import { TRPCError } from '@trpc/server'

import type { IronSession } from 'iron-session'

import db from '@/db'
import { Login } from '@/validations/auth'

import { t } from '../../trpc'
import { SecurePassword } from './auth-util'

export const authenticateUser = async (email: string, password: string) => {
  // emailをキーにDBからユーザーを取得
  const user = await db.user.findFirst({ where: { email } })

  if (!user) {
    // ユーザーが見つからない場合、エラー
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  // パスワードを検証
  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    // hashedPassword を更新
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword: improvedHash },
    })
  }

  // hashedPassword を除いたユーザー情報を返す
  const { hashedPassword, ...rest } = user
  return rest
}

export const login = async (session: IronSession, userId: string) => {
  // TODO DB の Session を作成

  // セッションにユーザーIDを保存
  session.userId = userId
  await session.save()
}

export const loginProcedure = t.procedure
  .input(Login)
  .mutation(async ({ input: { email, password }, ctx: { session } }) => {
    const user = await authenticateUser(email, password)
    await login(session, user.id)
    return
  })
