import { t } from '../../trpc'

//const logout = async (session) => {
//  // TODO DB の Session を削除
//
//  // セッションを破棄
//  session.destroy()
//}

export const logoutProcedure = t.procedure.mutation(async ({ ctx }) => {
  //await logout(session)
  return
})
