import Head from 'next/head'
import { useRouter } from 'next/router'

import type { NextPageWithLayout } from 'next'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'

export const ResetPassword: NextPageWithLayout = () => {
  const router = useRouter()

  const { token: tokenParam } = router.query
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam ?? ''

  if (!router.isReady) {
    return <div>loading</div>
  }

  return (
    <>
      <Head>
        <title>Change your password</title>
      </Head>
      <h1>Change your password</h1>
      <div>
        <ResetPasswordForm
          token={token}
          onSuccess={() => {
            alert('Password changed.')
          }}
        />
      </div>
    </>
  )
}

ResetPassword.getLayout = (page) => (
  <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
)
