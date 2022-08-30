import { t } from '../trpc'
import { authRouter } from './auth'

export const appRouter = t.router({
  auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
