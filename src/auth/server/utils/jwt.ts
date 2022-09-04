import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'

import { AnonymousSessionPayload } from '../types'

const JWT_NAMESPACE = 'myapp'
const JWT_ISSUER = 'myapp'
const JWT_AUDIENCE = 'myapp'
const JWT_ANONYMOUS_SUBJECT = 'anonymous'
const JWT_ALGORITHM = 'HS256'

export const createAnonymousSessionToken = (
  payload: AnonymousSessionPayload
): string => {
  const secret = process.env.SESSION_SECRET_KEY as string

  return jwtSign({ [JWT_NAMESPACE]: payload }, secret, {
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    subject: JWT_ANONYMOUS_SUBJECT,
  })
}

export const parseAnonymousSessionToken = (
  token: string
): AnonymousSessionPayload | null => {
  // This must happen outside the try/catch because it could throw an error
  // about a missing environment variable
  const secret = process.env.SESSION_SECRET_KEY as string

  try {
    const fullPayload = jwtVerify(token, secret, {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      subject: JWT_ANONYMOUS_SUBJECT,
    })

    if (typeof fullPayload === 'object') {
      return fullPayload[JWT_NAMESPACE] as AnonymousSessionPayload
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}
