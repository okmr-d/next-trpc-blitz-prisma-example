import { IronSessionOptions } from 'iron-session'

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    userId?: string
  }
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error('Failed to initialize process.env.SECRET_COOKIE_PASSWORD')
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'iron-session/examples/next.js',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
