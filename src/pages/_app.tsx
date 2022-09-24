import { getPublicDataStore } from '@blitzjs/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import type { AppPropsWithLayout } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { trpc } from '@/utils/trpc'

// @blitzjs/auth config
globalThis.__BLITZ_SUSPENSE_ENABLED = false
globalThis.__BLITZ_SESSION_COOKIE_PREFIX = 'myapp'

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  // To make queryClient available in @/utils/trpc.ts
  const queryClient = useQueryClient()
  useEffect(() => {
    globalThis.queryClient = queryClient
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getLayout = Component.getLayout ?? ((page) => <>{page}</>)

  return getLayout(<Component {...pageProps} />)
}) as AppType

export default trpc.withTRPC(MyApp)
