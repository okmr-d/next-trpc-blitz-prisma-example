import { t } from '../trpc'
import { helloProcedure } from './hello'

export const appRouter = t.router({
  hello: helloProcedure,
})

// export type definition of API
export type AppRouter = typeof appRouter
