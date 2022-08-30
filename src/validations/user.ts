import { z } from 'zod'

export const USER_NAME_MAX_LENGTH = 32

export const email = z
  .string()
  .email()
  .max(256)
  .transform((str) => str.toLowerCase().trim())

export const name = z
  .string()
  .min(1)
  .max(USER_NAME_MAX_LENGTH)
  .transform((str) => str.trim())

export const password = z
  .string()
  .min(1)
  .max(256)
  .transform((str) => str.trim())

export const newPassword = z
  .string()
  .min(8)
  .max(256)
  .transform((str) => str.trim())
