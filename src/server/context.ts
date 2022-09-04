import { inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { getSession, PrismaAdapter, AuthOptions } from '@/auth/server'

import { db } from './db'

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    cookie: {
      sessionExpiryMinutes: 30 * 24 * 60, // 30日
      sameSite: 'lax',
      secureCookies: process.env.NODE_ENV === 'production',
    },
  }
  const session = await getSession(req, res, authOptions)

  return {
    session,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
