import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <>{children}</>
}


