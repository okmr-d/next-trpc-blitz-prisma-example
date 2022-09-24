import { SecurePassword } from '@blitzjs/auth'

import { db } from '@/server/db'
import { AuthenticationError } from '@/server/errors'
import { t } from '@/server/trpc'
import { Role } from '@/types/blitz-auth'
import { Login } from '@/validations/auth'

export const authenticateUser = async (email: string, password: string) => {
  const user = await db.user.findFirst({ where: { email } })

  if (!user) {
    throw new AuthenticationError()
  }

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)

    await db.user.update({
      data: { hashedPassword: improvedHash },
      where: { id: user.id },
    })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export const loginProcedure = t.procedure
  .input(Login)
  .mutation(async ({ input: { email, password }, ctx: { session } }) => {
    const user = await authenticateUser(email, password)

    // Create new session
    await session.$create({
      userId: user.id,
      name: user.name,
      role: user.role as Role,
    })

    return
  })
