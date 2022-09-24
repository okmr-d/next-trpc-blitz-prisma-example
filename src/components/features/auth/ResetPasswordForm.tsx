import Link from 'next/link'
import { useState } from 'react'

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
  const [showForgotPasswordLink, setShowForgotPasswordLink] = useState(false)

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
          if (error.data?.errorName === 'ZodError' && error.data?.zodError) {
            return error.data.zodError.fieldErrors
          }
          if (error.data?.errorName === 'ResetPasswordTokenError') {
            setShowForgotPasswordLink(true)
            return { [FORM_ERROR]: error.message }
          }
          return { [FORM_ERROR]: 'Sorry, we had an unexpected error.' }
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
        {showForgotPasswordLink && (
          <div>
            Please <Link href="/auth/forgot-password">resend email</Link> again.
          </div>
        )}
      </div>
    </Form>
  )
}
