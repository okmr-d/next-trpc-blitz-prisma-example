import { TRPCError } from '@trpc/server'

import { t } from './trpc'

export const isAuthedMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.session.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // <-- auto-spreading old context, modify only what's changed
      session: ctx.session,
    },
  })
})
