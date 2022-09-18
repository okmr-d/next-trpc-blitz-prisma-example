import { z } from 'zod'

import { email, password, newPassword, name } from './user'

const token = z.string()

export const SendSignupEmail = z.object({
  email,
})

export const Signup = z.object({
  name,
  password: newPassword,
  token,
})

export const Login = z.object({
  email,
  password,
})

export const SendResetPasswordEmail = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: newPassword,
    passwordConfirmation: z.string(),
    token,
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: "Passwords don't match",
      path: ['passwordConfirmation'],
    },
  )

export const ChangePassword = z.object({
  currentPassword: password,
  newPassword: newPassword,
})

export const ConfirmEmail = z.object({
  token,
})
