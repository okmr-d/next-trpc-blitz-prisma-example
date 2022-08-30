import * as trpcNext from '@trpc/server/adapters/next'

import { createContext } from '@/server/context'
import { appRouter } from '@/server/routers/_app'

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ error, type, path, input, ctx, req }) => {
    console.error('Error:', error)
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // TODO バグレポートを送信
    }
  },
})
