import { ServerResponse } from 'http'

import cookie from 'cookie'

import {
  COOKIE_ANONYMOUS_SESSION_TOKEN,
  COOKIE_CSRF_TOKEN,
  COOKIE_SESSION_TOKEN,
} from '../../constants'
import { SessionConfig } from '../types'

export const setSessionCookie = (
  res: ServerResponse,
  sessionToken: string,
  expiresAt: Date,
  sessionConfig: SessionConfig
) => {
  setCookie(
    res,
    cookie.serialize(COOKIE_SESSION_TOKEN, sessionToken, {
      path: '/',
      httpOnly: true,
      secure: sessionConfig.secureCookies,
      sameSite: sessionConfig.sameSite,
      domain: sessionConfig.domain,
      expires: expiresAt,
    })
  )
}

export const setAnonymousSessionCookie = (
  res: ServerResponse,
  token: string,
  expiresAt: Date,
  sessionConfig: SessionConfig
) => {
  setCookie(
    res,
    cookie.serialize(COOKIE_ANONYMOUS_SESSION_TOKEN, token, {
      path: '/',
      httpOnly: true,
      secure: sessionConfig.secureCookies,
      sameSite: sessionConfig.sameSite,
      domain: sessionConfig.domain,
      expires: expiresAt,
    })
  )
}

export const setCSRFCookie = (
  res: ServerResponse,
  antiCSRFToken: string,
  expiresAt: Date,
  sessionConfig: SessionConfig
) => {
  setCookie(
    res,
    cookie.serialize(COOKIE_CSRF_TOKEN, antiCSRFToken, {
      path: '/',
      secure: sessionConfig.secureCookies,
      sameSite: sessionConfig.sameSite,
      domain: sessionConfig.domain,
      expires: expiresAt,
    })
  )
}

const setCookie = (res: ServerResponse, cookieStr: string) => {
  const getCookieName = (c: string) => c.split('=', 2)[0]
  const appendCookie = () => appendHeader(res, 'Set-Cookie', cookieStr)

  const cookiesHeader = res.getHeader('Set-Cookie')
  const cookieName = getCookieName(cookieStr)

  if (typeof cookiesHeader !== 'string' && !Array.isArray(cookiesHeader)) {
    appendCookie()
    return
  }

  if (typeof cookiesHeader === 'string') {
    if (cookieName === getCookieName(cookiesHeader)) {
      res.setHeader('Set-Cookie', cookieStr)
    } else {
      appendCookie()
    }
  } else {
    for (let i = 0; i < cookiesHeader.length; i++) {
      if (cookieName === getCookieName(cookiesHeader[i] || '')) {
        cookiesHeader[i] = cookieStr
        res.setHeader('Set-Cookie', cookiesHeader)
        return
      }
    }
    appendCookie()
  }
}

/**
 * Append additional header `field` with value `val`.
 *
 * Example:
 *
 *    append(res, 'Set-Cookie', 'foo=bar; Path=/; HttpOnly');
 *
 * @param {ServerResponse} res
 * @param {string} field
 * @param {string| string[]} val
 */
function appendHeader(
  res: ServerResponse,
  field: string,
  val: string | string[]
) {
  let prev: string | string[] | undefined = res.getHeader(field) as
    | string
    | string[]
    | undefined
  let value = val

  if (prev !== undefined) {
    // concat the new and prev vals
    value = Array.isArray(prev)
      ? prev.concat(val)
      : Array.isArray(val)
      ? [prev].concat(val)
      : [prev, val]
  }

  value = Array.isArray(value) ? value.map(String) : String(value)

  res.setHeader(field, value)
  return res
}
