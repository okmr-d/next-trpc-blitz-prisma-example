import { setupTRPC } from '@trpc/next'
import superjson from 'superjson'

import type { AppRouter } from '@/server/routers/_app'

const getBaseUrl = () => {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''
  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = setupTRPC<AppRouter>({
  config({ ctx }) {
    return {
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @link https://trpc.io/docs/ssr
       **/
      url: `${getBaseUrl()}/api/trpc`,

      /**
       * @link https://trpc.io/docs/data-transformers
       **/
      transformer: superjson,
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      //queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
})
