import { z } from 'zod'

import { FieldError } from '@/components/common/form/FieldError'
import { Form, FORM_ERROR } from '@/components/common/form/Form'
import { FormError } from '@/components/common/form/FormError'
import { SubmitButton } from '@/components/common/form/SubmitButton'
import { TextField } from '@/components/common/form/TextField'
import { trpc } from '@/utils/trpc'
import { SendSignupEmail } from '@/validations/auth'

type SendSignupEmailFormProps = {
  onSuccess?: () => void
}

export const SendSignupEmailForm = ({
  onSuccess,
}: SendSignupEmailFormProps) => {
  const sendSignupEmailMutation = trpc.proxy.auth.sendSignupEmail.useMutation()

  return (
    <Form
      schema={SendSignupEmail}
      initialValues={{ email: '' }}
      onSubmit={async ({ email }) => {
        try {
          await sendSignupEmailMutation.mutateAsync({ email })
        } catch (error: any) {
          return { [FORM_ERROR]: '予期せぬエラーが発生しました' }
        }
        onSuccess?.()
      }}
      resetOnSubmitSuccessful
    >
      <div>
        <TextField name="email" placeholder="Email" />
        <FieldError name="email" />
      </div>

      <div>
        <SubmitButton>送信</SubmitButton>
        <FormError />
      </div>
    </Form>
  )
}
