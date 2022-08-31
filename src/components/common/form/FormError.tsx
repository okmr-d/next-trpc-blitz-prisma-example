import { useFormErrorContext } from './Form'

export const FormError = () => {
  const { formError } = useFormErrorContext()

  return formError ? (
    <div role="alert" style={{ color: 'red' }}>
      {formError}
    </div>
  ) : null
}
