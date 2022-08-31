import { PropsWithoutRef } from 'react'
import { useFormContext } from 'react-hook-form'

export interface TextFieldProps
  extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  name: string
  type?: 'text' | 'password' | 'email' | 'number'
}

export const TextField = ({ name, ...props }: TextFieldProps) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext()

  return <input {...register(name)} disabled={isSubmitting} {...props} />
}
