/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client'

import { env } from './env'

declare global {
  var db: PrismaClient | undefined
}

export const db: PrismaClient =
  global.db ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV !== 'production') {
  global.db = db
}
