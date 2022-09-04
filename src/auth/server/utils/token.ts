import { fromBase64, toBase64 } from 'b64-lite'
import { customAlphabet } from 'nanoid'

import { AuthenticationError } from '../../errors'

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const generateToken = (size: number = 32) =>
  customAlphabet(alphabet, size)()

/**
 * Session Token
 */
const TOKEN_SEPARATOR = ';'

export const createSessionToken = (handle: string) => {
  return toBase64([handle, generateToken()].join(TOKEN_SEPARATOR))
}

export const parseSessionToken = (sessionToken: string) => {
  const [handle, randomToken] = fromBase64(sessionToken).split(TOKEN_SEPARATOR)

  if (!handle || !randomToken) {
    throw new AuthenticationError('Failed to parse session token')
  }

  return {
    handle,
  }
}
