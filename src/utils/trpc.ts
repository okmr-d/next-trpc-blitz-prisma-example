import {
  getAntiCSRFToken,
  HEADER_CSRF,
  HEADER_CSRF_ERROR,
  HEADER_SESSION_CREATED,
} from '@blitzjs/auth'
import { httpLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { NextPageContext } from 'next'
import superjson from 'superjson'

import type { AppRouter } from '@/server/routers/_app'

// default suspense config
globalThis.__BLITZ_SUSPENSE_ENABLED = false
globalThis.__BLITZ_SESSION_COOKIE_PREFIX = 'myapp'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // browser should use relative path
    return ''
  }
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

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @example
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   */
  status?: number
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config: ({ ctx }) => {
    return {
      transformer: superjson,
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       */
      //queryClientConfig: {
      //  defaultOptions: { queries: {} },
      //},
      headers: () => {
        const antiCSRFToken = getAntiCSRFToken()
        const antiCSRFTokenHeader = antiCSRFToken
          ? {
              [HEADER_CSRF]: antiCSRFToken,
            }
          : {}
        return {
          ...antiCSRFTokenHeader,
        }
      },
      fetch: async (input, init) => {
        return await window.fetch(input, init).then(async (response) => {
          if (response.headers) {
            if (response.headers.get(HEADER_SESSION_CREATED)) {
              // セッションが作られたら、キャッシュをクリアする。ログアウト時も匿名セッションが作られるので呼ばれる。
              await globalThis.queryClient.cancelQueries()
              await globalThis.queryClient.resetQueries()
              globalThis.queryClient.getMutationCache().clear()
            }
            if (response.headers.get(HEADER_CSRF_ERROR)) {
              console.log('csrf error')
            }
          }
          return response
        })
      },
    }
  },
  ssr: false,
})
