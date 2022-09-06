import { SecurePassword } from '@blitzjs/auth'

import { db } from '@/server/db'
import { AuthenticationError } from '@/server/errors'
import { t } from '@/server/trpc'
import { Login } from '@/validations/auth'

export const authenticateUser = async (email: string, password: string) => {
  // emailをキーにDBからユーザーを取得
  const user = await db.user.findFirst({ where: { email } })

  if (!user) {
    // ユーザーが見つからない場合、エラー
    throw new AuthenticationError()
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

export const loginProcedure = t.procedure
  .input(Login)
  .mutation(async ({ input: { email, password }, ctx: { session } }) => {
    const user = await authenticateUser(email, password)
    await session.$create({ userId: user.id })
    return
  })
