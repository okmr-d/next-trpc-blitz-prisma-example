import type { NextPageWithLayout } from 'next'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Home: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
