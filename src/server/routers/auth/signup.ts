import { hash256, SecurePassword } from '@blitzjs/auth'
import { Prisma, User } from '@prisma/client'

import { db } from '@/server/db'
import { t } from '@/server/trpc'
import { Role } from '@/types/blitz-auth'
import { generateId } from '@/utils/generateId'
import { Signup } from '@/validations/auth'

class SignupTokenError extends Error {
  name = 'SignupTokenError'
}

export const signupProcedure = t.procedure
  .input(Signup)
  .mutation(async ({ input: { token, name, password }, ctx: { session } }) => {
    // サインアップ用トークンを検索
    const hashedToken = hash256(token)
    const savedToken = await db.signupToken.findFirst({
      where: { hashedToken },
    })

    // 見つからない場合、エラー
    if (!savedToken) {
      // TODO
      throw new SignupTokenError()
    }

    // トークンを削除
    // この後の処理でエラーが発生したとしてももう使われないため
    await db.signupToken.delete({ where: { id: savedToken.id } })

    // トークンが有効期限切れの場合、エラー
    if (savedToken.expiresAt < new Date()) {
      // TODO
      throw new SignupTokenError()
    }

    // トークンが正しい場合、ユーザーを作成
    const userId = generateId()
    const hashedPassword = await SecurePassword.hash(password)
    let user: User | null = null
    try {
      user = await db.user.create({
        data: {
          id: userId,
          name,
          email: savedToken.sentTo,
          hashedPassword,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          (error.meta as any)?.target?.includes('email')
        ) {
          // メールアドレスの重複エラー
          // TODO
          throw new Error('Email is already in use.')
        }
      }
      throw error
    }

    await session.$create({ userId: user.id, role: user.role as Role })

    return
  })
