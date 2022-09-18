import { getSession, SessionContext } from '@blitzjs/auth'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const session = await getSession(req, res)
  return { session }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions): Promise<Context> {
  return await createContextInner({ req, res })
}
