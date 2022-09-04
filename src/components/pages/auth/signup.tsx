import type { NextPageWithLayout } from 'next'

import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'

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
