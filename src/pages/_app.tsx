import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import type { AppPropsWithLayout } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'

import { trpc } from '@/utils/trpc'

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>)

  // To make queryClient available in @/utils/trpc.ts
  const queryClient = useQueryClient()
  useEffect(() => {
    globalThis.queryClient = queryClient
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return getLayout(<Component {...pageProps} />)
}) as AppType

export default trpc.withTRPC(MyApp)
