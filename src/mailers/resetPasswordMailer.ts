/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

type ResetPasswordMailerProps = {
  to: string
  token: string
}

if (!process.env.NEXT_PUBLIC_APP_SITE_ORIGIN) {
  throw new Error(
    'Failed to initialize process.env.NEXT_PUBLIC_APP_SITE_ORIGIN'
  )
}

export function resetPasswordMailer({ to, token }: ResetPasswordMailerProps) {
  const origin = process.env.NEXT_PUBLIC_APP_SITE_ORIGIN
  const resetUrl = `${origin}/auth/reset-password?token=${token}`

  const msg = {
    from: 'TODO@example.com',
    to,
    subject: 'Your Password Reset Instructions',
    html: `
      <h1>Reset Your Password</h1>
      <a href="${resetUrl}">
        Click here to set a new password
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === 'production') {
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
        throw new Error(
          'No production email implementation in mailers/resetPasswordMailer'
        )
      } else {
        // Preview email in the browser
        const previewEmail = (await import('preview-email')).default
        await previewEmail(msg)
      }
    },
  }
}
