import { SimpleRolesIsAuthorized } from '@blitzjs/auth'
import { User } from '@prisma/client'

export type Role = 'ADMIN' | 'USER'

declare module '@blitzjs/auth' {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User['id']
      name: User['name']
      role: Role
    }
  }
}
