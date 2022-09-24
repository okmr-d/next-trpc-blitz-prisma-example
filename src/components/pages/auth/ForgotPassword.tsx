import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import type { NextPageWithLayout } from 'next'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { SendResetPasswordEmailForm } from '@/components/features/auth/SendResetPasswordEmailForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const ForgotPassword: NextPageWithLayout = () => {
  const router = useRouter()
  return (
    <>
      <h1>Forgot your password?</h1>
      <div>{"We'll send you a link to reset your password."}</div>

      <SendResetPasswordEmailForm
        onSuccess={() => {
          alert("We've sent you a password recovery link.")
          router.push('/auth/login')
        }}
      />
    </>
  )
}

ForgotPassword.getLayout = (page) => (
  <DefaultLayout>
    <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
  </DefaultLayout>
)
