import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { DashboardPage } from '@/components/pages/DashboardPage'

DashboardPage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>

export default DashboardPage
