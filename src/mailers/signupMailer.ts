/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */
import previewEmail from 'preview-email'

type SignupMailerProps = {
  to: string
  token: string
}

if (!process.env.NEXT_PUBLIC_APP_SITE_ORIGIN) {
  throw new Error(
    'Failed to initialize process.env.NEXT_PUBLIC_APP_SITE_ORIGIN'
  )
}

export function signupMailer({ to, token }: SignupMailerProps) {
  const origin = process.env.NEXT_PUBLIC_APP_SITE_ORIGIN
  const verifySignupUrl = `${origin}/auth/signup/email?token=${token}`

  const msg = {
    from: 'TODO@example.com',
    to,
    subject: 'Sign Up Verification',
    html: `
      <h1>Verify your email to sign up</h1>
      <a href="${verifySignupUrl}">
        Verify
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === 'production') {
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
        throw new Error(
          'No production email implementation in mailers/verifySignupMailer'
        )
      } else {
        // Preview email in the browser
        await previewEmail(msg)
      }
    },
  }
}
