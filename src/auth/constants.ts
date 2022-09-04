// Headers always all lower case
export const HEADER_SESSION_CREATED = 'session-created'
export const HEADER_CSRF = 'anti-csrf-token'
export const HEADER_CSRF_ERROR = 'csrf-error'

// Cookies
const cookiePrefix = process.env.NEXT_PUBLIC_SESSION_COOKIE_PREFIX ?? 'myapp'

export const COOKIE_SESSION_TOKEN = `${cookiePrefix}_SessionToken`
export const COOKIE_ANONYMOUS_SESSION_TOKEN = `${cookiePrefix}_AnonymousSessionToken`
export const COOKIE_CSRF_TOKEN = `${cookiePrefix}_AntiCsrfToken`
