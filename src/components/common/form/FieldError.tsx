import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'

type FieldErrorProps = {
  name: string
}

export const FieldError = ({ name }: FieldErrorProps) => {
  const {
    formState: { errors },
  } = useFormContext()

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <div role="alert" style={{ color: 'red' }}>
          {message}
        </div>
      )}
    />
  )
}
