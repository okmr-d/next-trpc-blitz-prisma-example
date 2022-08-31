import db from '@/db'
import { ResetPassword } from '@/validations/auth'

import { hash256, SecurePassword } from '../../auth-util'
import { t } from '../../trpc'
import { login } from './login'

export class ResetPasswordError extends Error {
  name = 'ResetPasswordError'
  message = 'Reset password link is invalid or it has expired.'
}

export const resetPasswordProcedure = t.procedure
  .input(ResetPassword)
  .mutation(async ({ input: { token, password }, ctx: { session } }) => {
    // パスワードリセット用トークンを検索
    const hashedToken = hash256(token)
    const savedToken = await db.resetPasswordToken.findFirst({
      where: { hashedToken },
    })

    // 見つからない場合、エラー
    if (!savedToken) {
      // TODO
      throw new ResetPasswordError()
    }

    // トークンを削除
    // この後の処理でエラーが発生したとしてももう使われないため
    await db.resetPasswordToken.delete({ where: { id: savedToken.id } })

    // トークンが有効期限切れの場合、エラー
    if (savedToken.expiresAt < new Date()) {
      //TODO
      throw new ResetPasswordError()
    }

    // トークンが正しい場合、ユーザーのパスワードを更新
    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.update({
      where: { id: savedToken.userId },
      data: { hashedPassword },
    })

    // TODO ユーザーのすべてのセッションを破棄
    //await db.session.deleteMany({ where: { userId: user.id } })

    // ログイン
    await login(session, user.id)

    return
  })
