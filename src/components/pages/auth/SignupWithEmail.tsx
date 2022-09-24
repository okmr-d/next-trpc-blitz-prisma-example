import { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { SignupWithEmailForm } from '@/components/features/auth/SingupWithEmailForm'

export const SignupWithEmail: NextPageWithLayout = () => {
  const router = useRouter()

  const { token: tokenParam } = router.query
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam ?? ''

  if (!router.isReady) {
    return <div>loading</div>
  }

  return (
    <>
      <h1>Sign up with Email</h1>
      <div>
        Please fill in the following fields to complete your registration.
      </div>
      <SignupWithEmailForm
        token={token}
        onSuccess={() => {
          alert("You've successfully signed up.")
        }}
      />
    </>
  )
}

SignupWithEmail.getLayout = (page) => (
  <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
)
