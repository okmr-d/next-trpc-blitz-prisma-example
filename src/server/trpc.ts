import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import type { Context } from './context'

import { AuthenticationError, CSRFTokenMismatchError } from './errors'

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error, ctx }) => {
    console.log({ shape, error })
    if (error.cause instanceof AuthenticationError) {
      return {
        code: 'UNAUTHENTICATED',
        data: {
          code: 'UNAUTHENTICATED',
          httpStatus: 401,
          message: 'unauthenticated',
        },
      }
    } else if (error.cause instanceof CSRFTokenMismatchError) {
      return {
        code: 'BAD_REQUEST',
        message: 'anti CSRF token does not match',
        data: {
          code: 'CSRF_TOKEN_MISMATCH',
          httpStatus: 400,
        },
      }
    }

    delete shape.data.stack

    return {
      ...shape,
      code: shape.data.code,
    }
  },
})
