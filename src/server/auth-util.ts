import * as crypto from 'crypto'

import { TRPCError } from '@trpc/server'
import SecurePasswordLib from 'secure-password'

import { generateId } from '@/utils/generateId'

export const hash256 = (input: string = '') => {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export const generateToken = (size: number = 32) => generateId(size)

const SP = () => new SecurePasswordLib()

export const SecurePassword = {
  ...SecurePasswordLib,
  async hash(password: string | null | undefined) {
    if (!password) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    const hashedBuffer = await SP().hash(Buffer.from(password))
    return hashedBuffer.toString('base64')
  },
  async verify(
    password: string | null | undefined,
    hashedPassword: string | null | undefined
  ) {
    if (!password || !hashedPassword) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    try {
      const result = await SP().verify(
        Buffer.from(password),
        Buffer.from(hashedPassword, 'base64')
      )
      // Return result for valid results.
      switch (result) {
        case SecurePassword.VALID:
        case SecurePassword.VALID_NEEDS_REHASH:
          return result
        default:
          // For everything else throw AuthenticationError
          throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    } catch (error) {
      // Could be error like failed to hash password
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
  },
}
