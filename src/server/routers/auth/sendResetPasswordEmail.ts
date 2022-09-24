import { hash256, generateToken } from '@blitzjs/auth'

import { resetPasswordMailer } from '@/mailers/resetPasswordMailer'
import { db } from '@/server/db'
import { t } from '@/server/trpc'
import { SendResetPasswordEmail } from '@/validations/auth'

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export const sendResetPasswordEmailProcedure = t.procedure
  .input(SendResetPasswordEmail)
  .mutation(async ({ input: { email } }) => {
    const user = await db.user.findFirst({
      where: { email },
    })

    if (user) {
      // Delete all tokens
      await db.resetPasswordToken.deleteMany({
        where: { userId: user.id },
      })

      // Save new token
      const token = generateToken()
      const hashedToken = hash256(token)
      const expiresAt = new Date()
      expiresAt.setHours(
        expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS
      )
      await db.resetPasswordToken.create({
        data: {
          user: { connect: { id: user.id } },
          expiresAt,
          hashedToken,
          sentTo: user.email,
        },
      })

      // Send email
      await resetPasswordMailer({ to: user.email, token }).send()
    } else {
      // If no user found wait the same time so attackers can't tell the difference
      await new Promise((resolve) => setTimeout(resolve, 750))
    }

    return
  })
