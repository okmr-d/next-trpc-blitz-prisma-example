import { IncomingMessage, ServerResponse } from 'http'

import { parse as cookieParse } from 'cookie'

import {
  HEADER_CSRF,
  HEADER_CSRF_ERROR,
  HEADER_SESSION_CREATED,
  COOKIE_ANONYMOUS_SESSION_TOKEN,
  COOKIE_SESSION_TOKEN,
} from '../constants'
import { CSRFTokenMismatchError } from '../errors'
import {
  AnonymousSessionPayload,
  AuthOptions,
  CookieConfig,
  Ctx,
  SessionConfig,
  SessionContext,
  SessionKernel,
  UserId,
} from './types'
import {
  addMinutes,
  addYears,
  differenceInMinutes,
  isPast,
} from './utils/calculate'
import {
  setAnonymousSessionCookie,
  setCSRFCookie,
  setSessionCookie,
} from './utils/cookie'
import {
  createAnonymousSessionToken,
  parseAnonymousSessionToken,
} from './utils/jwt'
import { hash256 } from './utils/securePassword'
import {
  generateToken,
  createSessionToken,
  parseSessionToken,
} from './utils/token'

const debug = require('debug')('session:')

function ensureApiRequest(
  req: IncomingMessage & { [key: string]: any }
): asserts req is IncomingMessage & { cookies: { [key: string]: string } } {
  if (!('cookies' in req)) {
    // Cookie parser isn't include inside getServerSideProps, so we have to add it
    req.cookies = cookieParse(req.headers.cookie || '')
  }
}

function ensureMiddlewareResponse(
  res: ServerResponse & { [key: string]: any }
): asserts res is ServerResponse & {
  myappCtx: Ctx
} {
  if (!('myappCtx' in res)) {
    res.myappCtx = {} as Ctx
  }
}

export async function getSession(
  req: IncomingMessage,
  res: ServerResponse,
  authOptions: AuthOptions
): Promise<SessionContext> {
  ensureApiRequest(req)
  ensureMiddlewareResponse(res)

  if (res.myappCtx.session) {
    return res.myappCtx.session
  }

  const defaultCookieConfig: CookieConfig = {
    sessionExpiryMinutes: 30 * 24 * 60, // Sessions expire after 30 days of being idle
    sameSite: 'lax',
    secureCookies: process.env.NODE_ENV === 'production',
  }

  const sessionConfig: SessionConfig = {
    ...authOptions.adapter,
    ...defaultCookieConfig,
    ...authOptions.cookie,
  }

  let sessionKernel = await getSessionKernel(req, res, sessionConfig)

  if (sessionKernel) {
    debug('Got existing session', sessionKernel)
  }

  if (!sessionKernel) {
    debug('No session found, creating anonymous session')
    sessionKernel = await createAnonymousSession(req, res, sessionConfig)
  }

  const sessionContext = makeProxyToPublicData(
    new SessionContextClass(req, res, sessionKernel, sessionConfig)
  )
  res.myappCtx.session = sessionContext

  return sessionContext
}

const makeProxyToPublicData = <T extends SessionContextClass>(
  ctxClass: T
): T => {
  return new Proxy(ctxClass, {
    get(target, prop, receiver) {
      //if (prop in target || prop === "then") {
      return Reflect.get(target, prop, receiver)
      //} else {
      //  return Reflect.get(target.$publicData, prop, receiver)
      //}
    },
  })
}

// --------------------------------
// Get Session Kernel
// --------------------------------
async function getSessionKernel(
  req: IncomingMessage & { cookies: { [key: string]: string } },
  res: ServerResponse,
  sessionConfig: SessionConfig
): Promise<SessionKernel | null> {
  const anonymousSessionToken = req.cookies[COOKIE_ANONYMOUS_SESSION_TOKEN]
  const sessionToken = req.cookies[COOKIE_SESSION_TOKEN]

  const enableCsrfProtection =
    req.method !== 'GET' && req.method !== 'OPTIONS' && req.method !== 'HEAD'
  const antiCSRFToken = req.headers[HEADER_CSRF] as string | undefined

  if (sessionToken) {
    const { handle } = parseSessionToken(sessionToken)

    if (!handle) {
      debug('No handle in sessionToken')
      return null
    }

    const persistedSession = await sessionConfig.getSession(handle)
    if (!persistedSession) {
      debug('Session not found in DB')
      return null
    }

    if (persistedSession.hashedSessionToken !== hash256(sessionToken)) {
      debug('sessionToken hash did not match')
      debug('persisted: ', persistedSession.hashedSessionToken)
      debug('in req: ', hash256(sessionToken))
      return null
    }

    if (isPast(persistedSession.expiresAt)) {
      debug('Session expired')
      return null
    }

    if (
      enableCsrfProtection &&
      persistedSession.antiCSRFToken !== antiCSRFToken
    ) {
      res.setHeader(HEADER_CSRF_ERROR, 'true')
      throw new CSRFTokenMismatchError()
    }

    /*
     * Session Renewal - Will renew if any of the following is true
     * 1) 1/4 of expiry time has elasped
     *
     *  But only renew with non-GET requests because a GET request could be from a
     *  browser level navigation
     */
    if (req.method !== 'GET') {
      // Check if > 1/4th of the expiry time has passed
      // (since we are doing a rolling expiry window).
      const hasQuarterExpiryTimePassed =
        differenceInMinutes(persistedSession.expiresAt, new Date()) <
        0.75 * sessionConfig.sessionExpiryMinutes

      if (hasQuarterExpiryTimePassed) {
        debug('quarter expiry time has passed')
        debug('Persisted expire time', persistedSession.expiresAt)
      }

      if (hasQuarterExpiryTimePassed) {
        const expiresAt = addMinutes(
          new Date(),
          sessionConfig.sessionExpiryMinutes
        )

        debug('Updating session in db with', { expiresAt })
        await sessionConfig.updateSession(handle, {
          expiresAt,
        })
      }
    }

    return {
      handle,
      userId: persistedSession.userId,
      antiCSRFToken: persistedSession.antiCSRFToken,
      sessionToken,
    }
  } else if (anonymousSessionToken) {
    const payload = parseAnonymousSessionToken(anonymousSessionToken)

    if (!payload) {
      debug('Payload empty')
      return null
    }

    if (enableCsrfProtection && payload.antiCSRFToken !== antiCSRFToken) {
      res.setHeader(HEADER_CSRF_ERROR, 'true')
      throw new CSRFTokenMismatchError()
    }

    return {
      handle: payload.handle,
      userId: payload.userId,
      antiCSRFToken: payload.antiCSRFToken,
      anonymousSessionToken,
    }
  }

  if (enableCsrfProtection) {
    res.setHeader(HEADER_CSRF_ERROR, 'true')
    throw new CSRFTokenMismatchError()
  }

  return null
}

class SessionContextClass implements SessionContext {
  private _req: IncomingMessage & { cookies: { [key: string]: string } }
  private _res: ServerResponse & { myappCtx: Ctx }
  private _kernel: SessionKernel
  private _sessionConfig: SessionConfig

  constructor(
    req: IncomingMessage & { cookies: { [key: string]: string } },
    res: ServerResponse & { myappCtx: Ctx },
    kernel: SessionKernel,
    sessionConfig: SessionConfig
  ) {
    this._req = req
    this._res = res
    this._kernel = kernel
    this._sessionConfig = sessionConfig
  }

  get $handle() {
    return this._kernel.handle
  }
  get userId() {
    return this._kernel.userId
  }

  async $create(userId: UserId) {
    this._kernel = await createNewSession(
      {
        req: this._req,
        res: this._res,
        userId,
        anonymous: false,
      },
      this._sessionConfig
    )
  }

  async $revoke() {
    if (this.userId) {
      try {
        await this._sessionConfig.deleteSession(this.$handle)
      } catch (error) {
        // Ignore any errors, like if session doesn't exist in DB
      }
    }
    this._kernel = await createAnonymousSession(
      this._req,
      this._res,
      this._sessionConfig
    )
  }

  async $revokeAll() {
    // $revoke() が走ると、this.userId が null になるので、先に取得しておく
    const tmpUserId = this.userId

    // revoke the current session which uses req/res
    await this.$revoke()

    // revoke other sessions for which there is no req/res object
    if (tmpUserId) {
      try {
        await this._sessionConfig.deleteAllSessions(tmpUserId)
      } catch (error) {
        // Ignore any errors, like if session doesn't exist in DB
      }
    }
    return
  }
}

interface CreateNewAnonSession {
  req: IncomingMessage
  res: ServerResponse
  userId: null
  anonymous: true
}
interface CreateNewAuthedSession {
  req: IncomingMessage
  res: ServerResponse
  userId: UserId
  anonymous: false
}

async function createNewSession(
  {
    req,
    res,
    userId,
    anonymous,
  }: CreateNewAnonSession | CreateNewAuthedSession,
  sessionConfig: SessionConfig
): Promise<SessionKernel> {
  const handle = generateToken()
  const antiCSRFToken = generateToken()

  debug('Creating new session')
  if (anonymous) {
    debug('Creating new anonymous session')
    const payload: AnonymousSessionPayload = {
      handle,
      userId,
      antiCSRFToken,
    }
    const anonymousSessionToken = createAnonymousSessionToken(payload)

    const expiresAt = addYears(new Date(), 30)
    setAnonymousSessionCookie(
      res,
      anonymousSessionToken,
      expiresAt,
      sessionConfig
    )
    setCSRFCookie(res, antiCSRFToken, expiresAt, sessionConfig)
    // 認証セッションをクリア
    setSessionCookie(res, '', new Date(0), sessionConfig)
    res.setHeader(HEADER_SESSION_CREATED, 'true')

    return {
      handle,
      userId: null,
      antiCSRFToken,
      anonymousSessionToken,
    }
  } else {
    const expiresAt = addMinutes(new Date(), sessionConfig.sessionExpiryMinutes)
    const sessionToken = createSessionToken(handle)

    await sessionConfig.createSession({
      handle,
      expiresAt,
      userId,
      hashedSessionToken: hash256(sessionToken),
      antiCSRFToken,
    })

    setSessionCookie(res, sessionToken, expiresAt, sessionConfig)
    setCSRFCookie(res, antiCSRFToken, expiresAt, sessionConfig)
    // 匿名セッションをクリア
    setAnonymousSessionCookie(res, '', new Date(0), sessionConfig)
    res.setHeader(HEADER_SESSION_CREATED, 'true')

    return {
      handle,
      userId,
      antiCSRFToken,
      sessionToken,
    }
  }
}

async function createAnonymousSession(
  req: IncomingMessage,
  res: ServerResponse,
  sessionConfig: SessionConfig
) {
  return await createNewSession(
    {
      req,
      res,
      userId: null,
      anonymous: true,
    },
    sessionConfig
  )
}
