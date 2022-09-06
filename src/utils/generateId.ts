import { customAlphabet } from 'nanoid'

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const generateId = customAlphabet(alphabet, 16)
