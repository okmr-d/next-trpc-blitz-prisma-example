import { useSession } from '@blitzjs/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { trpc } from '@/utils/trpc'

export const Header = () => {
  const { isLoading, userId } = useSession()
  const logoutMutation = trpc.auth.logout.useMutation()

  return (
    <header style={{ borderBottom: 'solid 1px #000' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '0.5rem',
        }}
      >
        <div>
          <Link href="/">Home</Link> <Link href="/dashboard">Dashboard</Link>
        </div>
        {!isLoading && (
          <div>
            {userId ? (
              <>
                <button
                  onClick={async () => {
                    await logoutMutation.mutateAsync()
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">Login</Link>{' '}
                <Link href="/auth/signup">Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
