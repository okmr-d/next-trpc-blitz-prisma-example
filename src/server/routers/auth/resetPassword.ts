import { hash256, SecurePassword } from '@blitzjs/auth'
import { TRPCError } from '@trpc/server'

import { db } from '@/server/db'
import { CustomError } from '@/server/errors'
import { t } from '@/server/trpc'
import { Role } from '@/types/blitz-auth'
import { ResetPassword } from '@/validations/auth'

class ResetPasswordTokenError extends CustomError {
  constructor() {
    super('link is invalid or it has expired')
    this.name = 'ResetPasswordTokenError'
  }
}

export const resetPasswordProcedure = t.procedure
  .input(ResetPassword)
  .mutation(async ({ input: { token, password }, ctx: { session } }) => {
    // Find token in database
    const hashedToken = hash256(token)
    const savedToken = await db.resetPasswordToken.findFirst({
      where: { hashedToken },
    })

    // Token not found
    if (!savedToken) {
      throw new ResetPasswordTokenError()
    }

    // Delete token
    await db.resetPasswordToken.delete({ where: { id: savedToken.id } })

    // Check token is not expired
    if (savedToken.expiresAt < new Date()) {
      throw new ResetPasswordTokenError()
    }

    // Update password
    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.update({
      data: { hashedPassword },
      where: { id: savedToken.userId },
    })

    // Revoke all sessions
    await db.session.deleteMany({
      where: { userId: user.id },
    })

    // Create new session
    await session.$create({
      userId: user.id,
      name: user.name,
      role: user.role as Role,
    })

    return
  })
