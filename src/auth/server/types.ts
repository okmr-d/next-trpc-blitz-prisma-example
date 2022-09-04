export interface Session {}

export type SessionModel = {
  handle: string
  hashedSessionToken: string
  userId: string
  expiresAt: Date
  antiCSRFToken: string
}

export type UserId = SessionModel['userId']

type AnonSessionKernel = {
  handle: string
  userId: null
  antiCSRFToken: string
  anonymousSessionToken: string
}
type AuthedSessionKernel = {
  handle: string
  userId: UserId
  antiCSRFToken: string
  sessionToken: string
}
export type SessionKernel = AnonSessionKernel | AuthedSessionKernel

export interface SessionContext {
  $handle: string
  userId: UserId | null
  $create: (userId: UserId) => Promise<void>
  $revoke: () => Promise<void>
  $revokeAll: () => Promise<void>
}

export interface Ctx {
  session: SessionContext
}

export type AnonymousSessionPayload = {
  handle: string
  userId: null
  antiCSRFToken: string
}

export interface SessionAdapter {
  getSession: (handle: string) => Promise<SessionModel | null>
  createSession: (session: SessionModel) => Promise<SessionModel>
  updateSession: (
    handle: string,
    session: Partial<SessionModel>
  ) => Promise<SessionModel | undefined>
  deleteSession: (handle: string) => Promise<SessionModel>
  deleteAllSessions: (userId: UserId) => Promise<{ count: number }>
}

export interface CookieConfig {
  sessionExpiryMinutes: number
  sameSite: 'none' | 'lax' | 'strict'
  secureCookies: boolean
  domain?: string
}

export interface SessionConfig extends SessionAdapter, CookieConfig {}

export interface AuthOptions {
  adapter: SessionAdapter
  cookie?: Partial<CookieConfig>
}
