import type { NextPageWithLayout } from 'next'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'

import { RedirectIfNotAuthenticated } from '../common/RedirectIfNotAuthenticated'

export const Dashboard: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>Only logged-in users can view this page</div>
    </div>
  )
}

Dashboard.getLayout = (page) => (
  <DefaultLayout>
    <RedirectIfNotAuthenticated>{page}</RedirectIfNotAuthenticated>
  </DefaultLayout>
)
