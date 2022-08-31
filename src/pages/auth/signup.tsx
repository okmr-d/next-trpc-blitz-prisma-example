import type { NextPage } from 'next'

import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'

const SignupPage: NextPage = () => {
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

export default SignupPage
