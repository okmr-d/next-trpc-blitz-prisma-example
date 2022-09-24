import { useRouter } from 'next/router'
import { useMemo } from 'react'

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
