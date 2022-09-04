import { FieldError } from '@/components/common/form/FieldError'
import { Form, FORM_ERROR } from '@/components/common/form/Form'
import { FormError } from '@/components/common/form/FormError'
import { SubmitButton } from '@/components/common/form/SubmitButton'
import { TextField } from '@/components/common/form/TextField'
import { trpc } from '@/utils/trpc'
import { Login } from '@/validations/auth'

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const loginMutation = trpc.proxy.auth.login.useMutation()

  return (
    <Form
      schema={Login}
      initialValues={{ email: '', password: '' }}
      onSubmit={async ({ email, password }) => {
        try {
          await loginMutation.mutateAsync({ email, password })
        } catch (error: any) {
          if (error.data?.code === 'UNAUTHORIZED') {
            return {
              [FORM_ERROR]: 'メールアドレスまたはパスワードが間違っています',
            }
          }
          console.log({ error })
          return { [FORM_ERROR]: '予期せぬエラーが発生しました' }
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
      </div>

      <div>
        <SubmitButton>ログイン</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
