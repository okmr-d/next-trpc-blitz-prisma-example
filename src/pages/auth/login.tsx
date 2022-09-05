import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { LoginPage } from '@/components/pages/auth/LoginPage'

LoginPage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
export default LoginPage
