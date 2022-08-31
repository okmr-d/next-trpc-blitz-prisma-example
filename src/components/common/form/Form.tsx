import { zodResolver } from '@hookform/resolvers/zod'
import { createContext, useContext, useEffect } from 'react'
import { useState, ReactNode, PropsWithoutRef } from 'react'
import { FormProvider, useForm, UseFormProps } from 'react-hook-form'
import { z } from 'zod'

// ------------------------------
// formError用 Context
const FormErrorContext = createContext<{
  formError: string | null
} | null>(null)
FormErrorContext.displayName = 'FormErrorContext'

export const useFormErrorContext = () => {
  const context = useContext(FormErrorContext)
  if (context === null) {
    throw new Error('missing a parent <FormErrorContext.Provider /> component.')
  }
  return context
}
// ------------------------------

interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements['form']>, 'onSubmit'> {
  children?: ReactNode
  schema?: S
  initialValues?: UseFormProps<z.infer<S>>['defaultValues']
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  resetOnSubmitSuccessful?: boolean
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = 'FORM_ERROR'

export function Form<S extends z.ZodType<any, any>>({
  children,
  schema,
  initialValues,
  onSubmit,
  resetOnSubmitSuccessful = false,
  ...props
}: FormProps<S>) {
  const ctx = useForm<z.infer<S>>({
    mode: 'onTouched',
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  })

  const [formError, setFormError] = useState<string | null>(null)

  const {
    formState: { isSubmitSuccessful },
    reset,
  } = ctx
  useEffect(() => {
    if (resetOnSubmitSuccessful && isSubmitSuccessful) {
      reset()
    }
  }, [resetOnSubmitSuccessful, isSubmitSuccessful, reset])

  return (
    <FormProvider {...ctx}>
      <FormErrorContext.Provider value={{ formError }}>
        <form
          onSubmit={ctx.handleSubmit(async (values) => {
            setFormError(null)
            const result = (await onSubmit(values)) || {}
            for (const [key, value] of Object.entries(result)) {
              if (key === FORM_ERROR) {
                setFormError(value)
              } else {
                ctx.setError(key as any, {
                  type: 'submit',
                  message: value,
                })
              }
            }
            if (Object.keys(result).length > 0) {
              return Promise.reject('Submit Error')
            }
          })}
          {...props}
        >
          {children}
        </form>
      </FormErrorContext.Provider>
    </FormProvider>
  )
}
