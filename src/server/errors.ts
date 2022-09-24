export { AuthenticationError, CSRFTokenMismatchError } from 'blitz'

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
  }
}
