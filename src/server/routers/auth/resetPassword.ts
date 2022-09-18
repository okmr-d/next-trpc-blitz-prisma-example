import { hash256, SecurePassword } from '@blitzjs/auth'
import { TRPCError } from '@trpc/server'

import { db } from '@/server/db'
import { t } from '@/server/trpc'
import { Role } from '@/types/blitz-auth'
import { ResetPassword } from '@/validations/auth'

class ResetPasswordTokenError extends TRPCError {
  constructor() {
    super({
      code: 'BAD_REQUEST',
      message: 'link is invalid or it has expired.',
    })
  }
}

export const resetPasswordProcedure = t.procedure
  .input(ResetPassword)
  .mutation(async ({ input: { token, password }, ctx: { session } }) => {
    const hashedToken = hash256(token)
    const savedToken = await db.resetPasswordToken.findFirst({
      where: { hashedToken },
    })

    if (!savedToken) {
      throw new ResetPasswordTokenError()
    }

    // Delete token
    await db.resetPasswordToken.delete({ where: { id: savedToken.id } })

    if (savedToken.expiresAt < new Date()) {
      throw new ResetPasswordTokenError()
    }

    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.update({
      where: { id: savedToken.userId },
      data: { hashedPassword },
    })

    // Revoke all sessions
    await db.session.deleteMany({
      where: { userId: user.id },
    })

    await session.$create({ userId: user.id, role: user.role as Role })

    return
  })
