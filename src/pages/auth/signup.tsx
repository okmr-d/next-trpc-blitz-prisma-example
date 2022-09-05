import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { SignupPage } from '@/components/pages/auth/signup'

SignupPage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>
export default SignupPage
