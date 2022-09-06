import { getSession } from '@blitzjs/auth'
import { inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const session = await getSession(req, res)

  return {
    session,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
