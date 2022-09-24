import Link from 'next/link'
import { useState } from 'react'

import {
  Form,
  FORM_ERROR,
  TextField,
  SubmitButton,
  FormError,
  FieldError,
} from '@/components/common/form'
import { trpc } from '@/utils/trpc'
import { SignupWithEmail } from '@/validations/auth'

type SignupWithEmailProps = {
  token: string
  onSuccess: () => void
}

export const SignupWithEmailForm = ({
  token,
  onSuccess,
}: SignupWithEmailProps) => {
  const signupWithEmailMutation = trpc.auth.signupWithEmail.useMutation()

  const [showSignupLink, setShowSignupLink] = useState(false)

  return (
    <Form
      schema={SignupWithEmail}
      initialValues={{ token, name: '', password: '' }}
      onSubmit={async (values) => {
        try {
          await signupWithEmailMutation.mutateAsync(values)
        } catch (error: any) {
          if (error.data?.errorName === 'ZodError' && error.data?.zodError) {
            return error.data.zodError.fieldErrors
          }
          if (error.data?.errorName === 'SignupTokenError') {
            setShowSignupLink(true)
            return { [FORM_ERROR]: error.message }
          }
          return { [FORM_ERROR]: 'Sorry, we had an unexpected error.' }
        }
        onSuccess()
      }}
    >
      <div>
        <TextField name="name" placeholder="Full Name" />
        <FieldError name="name" />
      </div>

      <div>
        <TextField type="password" name="password" placeholder="Password" />
        <FieldError name="password" />
      </div>

      <div>
        <SubmitButton>Sign Up</SubmitButton>
        <FormError />
        {showSignupLink && (
          <div>
            Please <Link href="/auth/signup">sign up</Link> again.
          </div>
        )}
      </div>
    </Form>
  )
}
