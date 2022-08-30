import { IronSessionOptions } from 'iron-session'

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    userId?: number
  }
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session/examples/next.js',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
