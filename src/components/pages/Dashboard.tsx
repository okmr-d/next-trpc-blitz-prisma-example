import type { NextPageWithLayout } from 'next'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'

export const Dashboard: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

Dashboard.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
