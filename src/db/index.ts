import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

declare global {
  var db: PrismaClient | undefined
}

const db =
  global.db ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.db = db
}
export default db
