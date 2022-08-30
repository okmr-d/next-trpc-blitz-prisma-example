import { inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { getIronSession } from 'iron-session'

import { sessionOptions } from '@/lib/session'

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  const session = await getIronSession(req, res, sessionOptions)

  return {
    session,
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
