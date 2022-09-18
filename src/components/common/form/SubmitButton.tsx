import { forwardRef, PropsWithoutRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { useFormErrorContext } from './Form'

type SubmitButtonProps = PropsWithoutRef<JSX.IntrinsicElements['button']> & {
  /** 初期状態で disabled にするか */
  disabledOnPristine?: boolean
  /** エラーがある状態で disabled にするか */
  disabledOnError?: boolean
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    { disabledOnPristine = false, disabledOnError = false, children, ...props },
    ref
  ) => {
    const {
      formState: { isSubmitting, isSubmitSuccessful, isValid, isDirty },
    } = useFormContext()

    const { formError } = useFormErrorContext()
    const hasError = !isValid || formError !== null

    // 送信成功後にページを移動する場合もあるので、isSubmitSuccessfulでもローディング状態のままにする。
    // その場合、reset()でローディング解除する
    const isLoading = isSubmitting || (isSubmitSuccessful && !hasError)

    const disabled =
      (disabledOnPristine && !isDirty) ||
      (disabledOnError && !isValid) ||
      isLoading ||
      props.disabled

    return (
      <button type="submit" ref={ref} {...props} disabled={disabled}>
        {children}
      </button>
    )
  }
)
SubmitButton.displayName = 'SubmitButton'
