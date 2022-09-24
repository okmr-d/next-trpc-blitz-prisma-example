import {
  Form,
  FORM_ERROR,
  FieldError,
  FormError,
  SubmitButton,
  TextField,
} from '@/components/common/form'
import { trpc } from '@/utils/trpc'
import { SendSignupEmail } from '@/validations/auth'

type SendSignupEmailFormProps = {
  onSuccess: () => void
}

export const SendSignupEmailForm = ({
  onSuccess,
}: SendSignupEmailFormProps) => {
  const sendSignupEmailMutation = trpc.auth.sendSignupEmail.useMutation()

  return (
    <Form
      schema={SendSignupEmail}
      initialValues={{ email: '' }}
      onSubmit={async ({ email }) => {
        try {
          await sendSignupEmailMutation.mutateAsync({ email })
        } catch (error: any) {
          if (error.data?.errorName === 'ZodError' && error.data?.zodError) {
            return error.data.zodError.fieldErrors
          }
          return { [FORM_ERROR]: 'Sorry, we had an unexpected error.' }
        }
        onSuccess()
      }}
      resetOnSubmitSuccessful
    >
      <div>
        <TextField name="email" placeholder="Email" />
        <FieldError name="email" />
      </div>

      <div>
        <SubmitButton>Submit</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
