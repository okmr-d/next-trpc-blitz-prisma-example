import {
  getAntiCSRFToken,
  HEADER_CSRF,
  HEADER_CSRF_ERROR,
  HEADER_SESSION_CREATED,
} from '@blitzjs/auth'
import { httpLink, loggerLink } from '@trpc/client'
import { setupTRPC } from '@trpc/next'
import { NextPageContext } from 'next'
import superjson from 'superjson'

import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'

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
export const trpc = setupTRPC<AppRouter>({
  config({ ctx }) {
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
              console.log('session created')
              // セッションが作られたら、キャッシュをクリアする。ログアウト時も匿名セッションが作られるので呼ばれる。
              setTimeout(async () => {
                console.log('clear cache')
                await globalThis.queryClient.cancelQueries()
                await globalThis.queryClient.resetQueries()
                globalThis.queryClient.getMutationCache().clear()
              }, 100)
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
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext

    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status,
      }
    }

    const error = opts.clientErrors[0]
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      }
    }

    // for app caching with SSR see https://trpc.io/docs/caching

    return {}
  },
})

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type inferQueryInput<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations']
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
