export class AuthenticationError extends Error {
  name = 'AuthenticationError'
  message = 'Please login'
}

export class CSRFTokenMismatchError extends Error {
  name = 'CSRFTokenMismatchError'
  message = 'CSRF token mismatch'
}
