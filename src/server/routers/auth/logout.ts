import { t } from '@/server/trpc'

export const logoutProcedure = t.procedure.mutation(
  async ({ ctx: { session } }) => {
    await session.$revoke()
    return
  }
)
