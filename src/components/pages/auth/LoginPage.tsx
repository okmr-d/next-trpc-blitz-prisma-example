import { LoginForm } from '@/components/features/auth/LoginForm'
import type { NextPageWithLayout } from '@/pages/_app'

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
