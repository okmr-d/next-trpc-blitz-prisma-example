import { AuthenticationError } from '@/auth/errors'

import { t } from './trpc'

export const isAuthedMiddleware = t.middleware(
  async ({ next, ctx: { session } }) => {
    if (!session.userId) {
      throw new AuthenticationError()
    }
    return next({
      ctx: {
        // <-- auto-spreading old context, modify only what's changed
      },
    })
  }
)
