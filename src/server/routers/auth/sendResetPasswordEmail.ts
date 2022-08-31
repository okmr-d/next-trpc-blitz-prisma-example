import { prisma } from '@/server/prisma'
import { SendResetPasswordEmail } from '@/validations/auth'

import { generateToken, hash256 } from '../../auth-util'
import { t } from '../../trpc'

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export const sendResetPasswordEmailProcedure = t.procedure
  .input(SendResetPasswordEmail)
  .mutation(async ({ input: { email } }) => {
    // ユーザーを取得
    const user = await prisma.user.findFirst({
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
      await prisma.resetPasswordToken.deleteMany({
        where: { userId: user.id },
      })

      // パスワードリセット用トークンを作成
      await prisma.resetPasswordToken.create({
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
