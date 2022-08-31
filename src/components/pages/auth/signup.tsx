import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'
import type { NextPageWithLayout } from '@/pages/_app'

export const SignupPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SendSignupEmailForm
        onSuccess={() => {
          alert('メールを送信しました')
        }}
      />
    </div>
  )
}
