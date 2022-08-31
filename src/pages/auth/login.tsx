import type { NextPage } from 'next'

import { LoginForm } from '@/components/features/auth/LoginForm'

const LoginPage: NextPage = () => {
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

export default LoginPage
