import {
  AuthServerPlugin,
  PrismaStorage,
  simpleRolesIsAuthorized,
} from '@blitzjs/auth'
import * as trpcNext from '@trpc/server/adapters/next'

import { createContext } from '@/server/context'
import { db } from '@/server/db'
import { appRouter } from '@/server/routers/_app'

// @blitzjs/auth server plugin
AuthServerPlugin({
  cookiePrefix: 'myapp',
  storage: PrismaStorage(db),
  isAuthorized: simpleRolesIsAuthorized,
})

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ error, type, path, input, ctx, req }) => {
    console.error('onError:', error)
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // TODO send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  batching: {
    enabled: false,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
})
