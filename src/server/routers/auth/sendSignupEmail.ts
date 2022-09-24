import { hash256, generateToken } from '@blitzjs/auth'
import { ZodError } from 'zod'

import { signupMailer } from '@/mailers/signupMailer'
import { db } from '@/server/db'
import { t } from '@/server/trpc'
import { SendSignupEmail } from '@/validations/auth'

const VERIFY_SIGNUP_TOKEN_EXPIRATION_IN_HOURS = 1

export const sendSignupEmailProcedure = t.procedure
  .input(SendSignupEmail)
  .mutation(async ({ input: { email } }) => {
    // Check email is not already in use
    const user = await db.user.findFirst({
      where: { email },
    })
    if (user) {
      throw new ZodError([
        {
          code: 'custom',
          path: ['email'],
          message: 'Email is already taken',
        },
      ])
    }

    // Delete all old tokens
    await db.signupToken.deleteMany({ where: { sentTo: email } })

    // Save new token
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(
      expiresAt.getHours() + VERIFY_SIGNUP_TOKEN_EXPIRATION_IN_HOURS
    )
    await db.signupToken.create({
      data: {
        hashedToken,
        expiresAt,
        sentTo: email,
      },
    })

    // Send email
    await signupMailer({ to: email, token }).send()

    return
  })
