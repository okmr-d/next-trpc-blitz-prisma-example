import { useSession } from '@blitzjs/auth'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'

export const RedirectIfAuthenticated = ({
  children,
}: PropsWithChildren<{}>) => {
  const router = useRouter()
  const { isLoading, userId } = useSession()
  const { next: nextPathParam } = router.query

  useEffect(() => {
    if (!isLoading && userId) {
      const nextPath =
        nextPathParam && typeof nextPathParam === 'string'
          ? decodeURIComponent(nextPathParam)
          : '/dashboard'
      router.replace(nextPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, userId])

  return <>{children}</>
}
