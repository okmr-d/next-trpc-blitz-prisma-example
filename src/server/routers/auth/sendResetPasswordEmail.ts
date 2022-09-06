import { hash256, generateToken } from '@blitzjs/auth'

import { db } from '@/server/db'
import { t } from '@/server/trpc'
import { SendResetPasswordEmail } from '@/validations/auth'

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export const sendResetPasswordEmailProcedure = t.procedure
  .input(SendResetPasswordEmail)
  .mutation(async ({ input: { email } }) => {
    // ユーザーを取得
    const user = await db.user.findFirst({
      where: { email },
    })

    // トークンと有効期限を生成
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(
      expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS
    )

    if (user) {
      // ユーザーが存在する場合
      // 存在する古いトークンを削除
      await db.resetPasswordToken.deleteMany({
        where: { userId: user.id },
      })

      // パスワードリセット用トークンを作成
      await db.resetPasswordToken.create({
        data: {
          user: { connect: { id: user.id } },
          expiresAt,
          hashedToken,
          sentTo: user.email,
        },
      })

      // TODO メールを送信
      // await resetPasswordMailer({ to: user.email, token }).send()
    } else {
      // ユーザーが存在しない場合
      // ユーザーが存在した場合との違いを攻撃者に分からせないようにするため、同じくらいの時間待つ
      await new Promise((resolve) => setTimeout(resolve, 750))
    }

    // 同じ結果を返す
    return
  })
