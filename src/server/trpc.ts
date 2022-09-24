import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import type { Context } from './context'

import {
  AuthenticationError,
  CSRFTokenMismatchError,
  CustomError,
} from './errors'

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error, ctx }) => {
    if (error.cause instanceof AuthenticationError) {
      return {
        ...shape,
        message: 'You must be logged in to access this',
        data: {
          ...shape.data,
          code: 'UNAUTHORIZED',
          httpStatus: 401,
          errorName: 'AuthenticationError',
        },
      }
    } else if (error.cause instanceof CSRFTokenMismatchError) {
      return {
        ...shape,
        message: 'Anti CSRF token does not match',
        data: {
          ...shape.data,
          code: 'BAD_REQUEST',
          httpStatus: 400,
          errorName: 'CSRFTokenMismatchError',
        },
      }
    } else if (error.cause instanceof ZodError) {
      return {
        ...shape,
        message: 'Validation failed',
        data: {
          ...shape.data,
          code: 'BAD_REQUEST',
          httpStatus: 400,
          errorName: 'ZodError',
          zodError: error.cause.flatten(),
        },
      }
    } else if (error.cause instanceof CustomError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: 'BAD_REQUEST',
          httpStatus: 400,
          errorName: error.cause.name,
        },
      }
    }

    return shape
  },
})
