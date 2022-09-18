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
          return { [FORM_ERROR]: 'Sorry, something went wrong' }
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
