import { useSession } from '@blitzjs/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'

export const RedirectIfNotAuthenticated = ({
  children,
}: PropsWithChildren<{}>) => {
  const router = useRouter()
  const { isLoading, userId } = useSession()

  useEffect(() => {
    if (!isLoading && !userId) {
      const nextPath = encodeURIComponent(router.asPath)
      router.replace(`/auth/login?next=${nextPath}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, userId])

  if (isLoading || !userId) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <div>Loading...</div>
      </>
    )
  }

  return <>{children}</>
}
