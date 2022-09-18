import {
  Form,
  FORM_ERROR,
  FieldError,
  FormError,
  SubmitButton,
  TextField,
} from '@/components/common/form'
import { trpc } from '@/utils/trpc'
import { ResetPassword } from '@/validations/auth'

type ResetPasswordFormProps = {
  token: string
  onSuccess: () => void
}

export const ResetPasswordForm = ({
  token,
  onSuccess,
}: ResetPasswordFormProps) => {
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation()

  return (
    <Form
      schema={ResetPassword}
      initialValues={{
        token: token,
        password: '',
        passwordConfirmation: '',
      }}
      onSubmit={async (values) => {
        try {
          await resetPasswordMutation.mutateAsync(values)
          onSuccess()
        } catch (error: any) {
          if (error.name === 'TRPCClientError') {
            return {
              [FORM_ERROR]: error.message || 'Sorry, something went wrong',
            }
          } else {
            return {
              [FORM_ERROR]: 'Sorry, something went wrong',
            }
          }
        }
      }}
    >
      <div>
        <TextField
          type="password"
          id="password"
          name="password"
          placeholder="New password"
        />
        <FieldError name="password" />
      </div>

      <div>
        <TextField
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          placeholder="Confirm new password"
        />
        <FieldError name="passwordConfirmation" />
      </div>

      <div>
        <SubmitButton>Change password</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
