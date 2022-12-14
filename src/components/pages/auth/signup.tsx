import Head from 'next/head'
import Link from 'next/link'

import type { NextPageWithLayout } from 'next'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Signup: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <h1>Sign Up</h1>
      <SendSignupEmailForm
        onSuccess={() => {
          alert("We've sent you a register link.")
        }}
      />
      <hr />
      <div>
        Have an account? <Link href="/auth/login">Login</Link>
      </div>
    </>
  )
}

Signup.getLayout = (page) => (
  <DefaultLayout>
    <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
  </DefaultLayout>
)
