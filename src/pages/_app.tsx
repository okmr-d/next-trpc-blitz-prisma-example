import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'
import type { ReactElement, ReactNode } from 'react'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { trpc } from '@/utils/trpc'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return getLayout(<Component {...pageProps} />)
}) as AppType

export default trpc.withTRPC(MyApp)
