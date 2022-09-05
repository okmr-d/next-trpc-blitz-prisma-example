import type { AppPropsWithLayout } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'

import { trpc } from '@/utils/trpc'

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>)

  //const queryClient = trpc.useContext().queryClient
  //useEffect(() => {
  //  // グローバル変数に入れてどこでも使えるようにする
  //  globalThis.queryClient = queryClient
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [])

  return getLayout(<Component {...pageProps} />)
}) as AppType

export default trpc.withTRPC(MyApp)
