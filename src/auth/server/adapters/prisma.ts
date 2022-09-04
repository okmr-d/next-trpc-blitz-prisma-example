import { SessionAdapter, SessionModel } from '../types'

interface PrismaClientWithSession {
  session: {
    findFirst(args?: {
      where?: { handle?: SessionModel['handle'] }
    }): Promise<SessionModel | null>
    create(args: { data: SessionModel }): Promise<SessionModel>
    update(args: {
      data: Partial<SessionModel>
      where: { handle: SessionModel['handle'] }
    }): Promise<SessionModel>
    delete(args: {
      where: { handle: SessionModel['handle'] }
    }): Promise<SessionModel>
    deleteMany(args: {
      where: { userId: SessionModel['userId'] }
    }): Promise<{ count: number }>
  }
}

export const PrismaAdapter = <Client extends PrismaClientWithSession>(
  db: Client
): SessionAdapter => {
  return {
    getSession: (handle) => db.session.findFirst({ where: { handle } }),
    createSession: (session) => {
      return db.session.create({
        data: { ...session },
      })
    },
    updateSession: async (handle, data) => {
      try {
        return await db.session.update({
          where: { handle },
          data,
        })
      } catch (error: any) {
        // Session doesn't exist in DB for some reason, so create it
        if (error.code === 'P2016') {
          console.warn("Could not update session because it's not in the DB")
        } else {
          throw error
        }
      }
    },
    deleteSession: (handle) => db.session.delete({ where: { handle } }),
    deleteAllSessions: (userId) => db.session.deleteMany({ where: { userId } }),
  }
}
