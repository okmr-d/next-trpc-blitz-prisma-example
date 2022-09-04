import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Head from 'next/head'
import { ReactNode } from 'react'

type DefaultLayoutProps = { children: ReactNode }

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      {children}
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}