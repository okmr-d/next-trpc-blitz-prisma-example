import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSession } from './useSession'

export const useRedirectNextPathIfAuthenticated = () => {
  const router = useRouter()
  const session = useSession()

  const { next } = router.query
  const nextPath =
    next && typeof next === 'string' ? decodeURIComponent(next) : '/dashboard'

  //　ランディング時 (isLoading が false => true になるタイミング) で認証済みの場合はリプレイス
  useEffect(() => {
    if (!session.isLoading && session.userId) {
      router.replace(nextPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoading])
}
