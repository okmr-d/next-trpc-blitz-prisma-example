import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

import { Header } from '../common/Header'

type DefaultLayoutProps = { children: ReactNode }

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
