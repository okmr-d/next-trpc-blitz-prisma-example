import type { NextPageWithLayout } from 'next'

import { SendSignupEmailForm } from '@/components/features/auth/SendSignupEmailForm'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { useRedirectNextPathIfAuthenticated } from '@/hooks/useRedirect'
import { useSession } from '@/hooks/useSession'

export const Signup: NextPageWithLayout = () => {
  useRedirectNextPathIfAuthenticated()

  const session = useSession()
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

Signup.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
