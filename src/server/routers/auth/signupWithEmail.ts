import { hash256, SecurePassword } from '@blitzjs/auth'
import { Prisma, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

import { db } from '@/server/db'
import { CustomError } from '@/server/errors'
import { t } from '@/server/trpc'
import { Role } from '@/types/blitz-auth'
import { generateId } from '@/utils/generateId'
import { SignupWithEmail } from '@/validations/auth'

class SignupTokenError extends CustomError {
  constructor() {
    super('link is invalid or it has expired')
    this.name = 'SignupTokenError'
  }
}

export const signupWithEmailProcedure = t.procedure
  .input(SignupWithEmail)
  .mutation(async ({ input: { token, name, password }, ctx: { session } }) => {
    // Find token in database
    const hashedToken = hash256(token)
    const savedToken = await db.signupToken.findFirst({
      where: { hashedToken },
    })

    // Token not found
    if (!savedToken) {
      throw new SignupTokenError()
    }

    // Delete token
    await db.signupToken.delete({ where: { id: savedToken.id } })

    // Check token is not expired
    if (savedToken.expiresAt < new Date()) {
      throw new SignupTokenError()
    }

    // Create user
    const userId = generateId()
    const hashedPassword = await SecurePassword.hash(password)
    let user: User | null = null
    try {
      user = await db.user.create({
        data: {
          id: userId,
          name,
          email: savedToken.sentTo,
          hashedPassword,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint failed
        if (
          error.code === 'P2002' &&
          (error.meta as any)?.target?.includes('email')
        ) {
          throw new ZodError([
            {
              code: 'custom',
              path: ['email'],
              message: 'Email is already in use',
            },
          ])
        }
      }
      throw error
    }

    // cteate new session
    await session.$create({
      userId: user.id,
      name: user.name,
      role: user.role as Role,
    })

    return
  })
