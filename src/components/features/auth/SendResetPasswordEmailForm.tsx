import {
  Form,
  FORM_ERROR,
  SubmitButton,
  FormError,
  TextField,
  FieldError,
} from '@/components/common/form'
import { trpc } from '@/utils/trpc'
import { SendResetPasswordEmail } from '@/validations/auth'

type SendResetPasswordEmailFormProps = {
  onSuccess: () => void
}

export const SendResetPasswordEmailForm = ({
  onSuccess,
}: SendResetPasswordEmailFormProps) => {
  const sendResetPasswordEmailMutation =
    trpc.auth.sendResetPasswordEmail.useMutation()

  return (
    <Form
      schema={SendResetPasswordEmail}
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        try {
          await sendResetPasswordEmailMutation.mutateAsync(values)
          onSuccess()
        } catch (error: any) {
          return {
            [FORM_ERROR]: 'Sorry, something went wrong',
          }
        }
      }}
    >
      <div>
        <TextField
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
        />
        <FieldError name="email" />
      </div>

      <div>
        <SubmitButton>Submit</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
