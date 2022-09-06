import type { NextPageWithLayout } from 'next'

import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'
import { useRedirectNextPathIfAuthenticated } from '@/hooks/useRedirect'
import { useSession } from '@/hooks/useSession'

export const SignupPage: NextPageWithLayout = () => {
  const session = useSession()
  useRedirectNextPathIfAuthenticated()

  if (session.isLoading || session.userId) {
    return <div>Loading...</div>
  }

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
