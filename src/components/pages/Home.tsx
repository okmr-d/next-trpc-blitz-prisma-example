import Head from 'next/head'

import type { NextPageWithLayout } from 'next'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div>
        <h1>Home</h1>
      </div>
    </>
  )
}

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
