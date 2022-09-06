import { AuthenticationError } from './errors'
import { t } from './trpc'

export const isAuthedMiddleware = t.middleware(
  async ({ next, ctx: { session } }) => {
    if (!session.$isAuthorized()) {
      throw new AuthenticationError()
    }
    return next()
  }
)
