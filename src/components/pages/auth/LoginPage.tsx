import type { NextPageWithLayout } from 'next'

import { LoginForm } from '@/components/features/auth/LoginForm'

export const LoginPage: NextPageWithLayout = () => {
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
