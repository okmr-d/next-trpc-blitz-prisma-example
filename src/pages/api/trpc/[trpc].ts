import { initTRPC } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { z } from 'zod'

export const t = initTRPC()({
  transformer: superjson,
})

export const appRouter = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
