import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { HomePage } from '@/components/pages/home/HomePage'

HomePage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>

export default HomePage
