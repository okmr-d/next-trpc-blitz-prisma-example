import { useSession } from '@blitzjs/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import type { NextPageWithLayout } from 'next'

import { RedirectIfAuthenticated } from '@/components/common/RedirectIfAuthenticated'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Login: NextPageWithLayout = () => {
  return (
    <div>
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
    </div>
  )
}

Login.getLayout = (page) => (
  <DefaultLayout>
    <RedirectIfAuthenticated>{page}</RedirectIfAuthenticated>
  </DefaultLayout>
)
