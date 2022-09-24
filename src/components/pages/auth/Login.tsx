import Head from 'next/head'
import Link from 'next/link'

import type { NextPageWithLayout } from 'next'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <h1>Login</h1>
      <LoginForm
        onSuccess={() => {
          alert("You've successfully logged in.")
        }}
      />
      <hr />
      <div>
        {"Don't have an account?"} <Link href="/auth/signup">Sign up</Link>
      </div>
    </>
  )
}

Login.getLayout = (page) => (
  <DefaultLayout>
    <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
  </DefaultLayout>
)
