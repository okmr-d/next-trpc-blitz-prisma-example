import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

const db = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
})
export default db
