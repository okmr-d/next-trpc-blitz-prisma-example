import Link from 'next/link'

import type { NextPageWithLayout } from 'next'

import { LoginForm } from '@/components/features/auth/LoginForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { useRedirectNextPathIfAuthenticated } from '@/hooks/useRedirect'
import { useSession } from '@/hooks/useSession'

export const Login: NextPageWithLayout = () => {
  useRedirectNextPathIfAuthenticated()

  const session = useSession()
  if (session.isLoading || session.userId) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Login</h1>
      <LoginForm
        onSuccess={() => {
          console.log('login success')
        }}
      />
      <Link href="/auth/signup">{"Don't have an account?"}</Link>
    </div>
  )
}

Login.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
