import db from '@/db'
import { SendSignupEmail } from '@/validations/auth'

import { t } from '../../trpc'
import { generateToken, hash256 } from './auth-util'

const VERIFY_SIGNUP_TOKEN_EXPIRATION_IN_HOURS = 1

class SignupError extends Error {
  name = 'SignupError'
  message = 'このメールアドレスはすでに使用されています。'
}

export const sendSignupEmailProcedure = t.procedure
  .input(SendSignupEmail)
  .mutation(async ({ input: { email } }) => {
    // ユーザーを取得
    const user = await db.user.findFirst({
      where: { email },
    })

    if (user) {
      // 登録済みの場合はエラー
      //TODO
      throw new SignupError()
    }

    // トークンと有効期限を生成
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(
      expiresAt.getHours() + VERIFY_SIGNUP_TOKEN_EXPIRATION_IN_HOURS
    )

    // 存在する古いトークンを削除
    await db.signupToken.deleteMany({ where: { sentTo: email } })

    // サインアップ用トークンを作成
    await db.signupToken.create({
      data: {
        hashedToken,
        expiresAt,
        sentTo: email,
      },
    })

    // TODO メールを送信
    //await signupMailer({ to: email, token }).send()

    return
  })
