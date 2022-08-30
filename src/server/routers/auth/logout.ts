import type { IronSession } from 'iron-session'

import { t } from '../../trpc'

const logout = async (session: IronSession) => {
  // TODO DB の Session を削除

  // セッションを破棄
  session.destroy()
}

export const logoutProcedure = t.procedure.mutation(
  async ({ ctx: { session } }) => {
    await logout(session)
    return
  }
)
