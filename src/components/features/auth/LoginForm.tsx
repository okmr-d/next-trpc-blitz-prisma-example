import Link from 'next/link'

import {
  Form,
  FORM_ERROR,
  FieldError,
  FormError,
  SubmitButton,
  TextField,
} from '@/components/common/form'
import { trpc } from '@/utils/trpc'
import { Login } from '@/validations/auth'

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const loginMutation = trpc.auth.login.useMutation()

  return (
    <Form
      schema={Login}
      initialValues={{ email: '', password: '' }}
      onSubmit={async ({ email, password }) => {
        try {
          await loginMutation.mutateAsync({ email, password })
        } catch (error: any) {
          if (error.data?.code === 'UNAUTHENTICATED') {
            return {
              [FORM_ERROR]: 'Invalid email or password',
            }
          }
          return { [FORM_ERROR]: 'Sorry, something went wrong' }
        }
        onSuccess?.()
      }}
    >
      <div>
        <TextField name="email" placeholder="Email" />
        <FieldError name="email" />
      </div>

      <div>
        <TextField type="password" name="password" placeholder="Password" />
        <FieldError name="password" />
        <div>
          <Link href="/auth/forgot-password">Forgot Password?</Link>
        </div>
      </div>

      <div>
        <SubmitButton>Login</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
