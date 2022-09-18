import Link from 'next/link'
import { useState } from 'react'

import type { NextPageWithLayout } from 'next'

import { SendResetPasswordEmailForm } from '@/components/features/auth/SendResetPasswordEmailForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { useRedirectNextPathIfAuthenticated } from '@/hooks/useRedirect'
import { useSession } from '@/hooks/useSession'

export const ForgotPassword: NextPageWithLayout = () => {
  const [isSubmitSucceeded, setIsSubmitSucceeded] = useState(false)

  useRedirectNextPathIfAuthenticated()

  const session = useSession()
  if (session.isLoading || session.userId) {
    return <div>Loading...</div>
  }

  return isSubmitSucceeded ? (
    <>
      <h1>Request Submitted</h1>
      <div>
        If your email address exists in our system, you will receive a password
        recovery link at your email address in a few minutes.
      </div>
      <div>
        <Link href="/auth/login">← Back to Login Page</Link>
      </div>
    </>
  ) : (
    <>
      <h1>Forgot your password?</h1>
      <div>{"We'll send you a link to reset your password."}</div>

      <SendResetPasswordEmailForm
        onSuccess={() => {
          setIsSubmitSucceeded(true)
        }}
      />
    </>
  )
}

ForgotPassword.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
