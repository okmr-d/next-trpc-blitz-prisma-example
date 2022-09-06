import type { NextPageWithLayout } from 'next'

import { LoginForm } from '@/components/features/auth/LoginForm'
import { useRedirectNextPathIfAuthenticated } from '@/hooks/useRedirect'
import { useSession } from '@/hooks/useSession'

export const LoginPage: NextPageWithLayout = () => {
  const session = useSession()
  useRedirectNextPathIfAuthenticated()

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
    </div>
  )
}
