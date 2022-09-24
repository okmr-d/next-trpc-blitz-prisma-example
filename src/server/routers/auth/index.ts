import { t } from '../../trpc'
import { loginProcedure } from './login'
import { logoutProcedure } from './logout'
import { resetPasswordProcedure } from './resetPassword'
import { sendResetPasswordEmailProcedure } from './sendResetPasswordEmail'
import { sendSignupEmailProcedure } from './sendSignupEmail'
import { signupWithEmailProcedure } from './signupWithEmail'

export const authRouter = t.router({
  sendSignupEmail: sendSignupEmailProcedure,
  signupWithEmail: signupWithEmailProcedure,
  login: loginProcedure,
  logout: logoutProcedure,
  sendResetPasswordEmail: sendResetPasswordEmailProcedure,
  resetPassword: resetPasswordProcedure,
})
