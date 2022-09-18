import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type { NextPageWithLayout } from 'next'

import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const ResetPassword: NextPageWithLayout = () => {
  const router = useRouter()

  const { token: tokenParam } = router.query
  const token =
    tokenParam && Array.isArray(tokenParam) ? tokenParam[0] : tokenParam ?? ''

  return (
    <>
      <h1>Change your password</h1>
      <div>
        <ResetPasswordForm
          token={token}
          onSuccess={() => {
            alert('Password changed.')
            router.replace('/dashboard')
          }}
        />
      </div>
    </>
  )
}

ResetPassword.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
