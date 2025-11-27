import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getSession as getBackendSession, signOut as authSignOut, type AuthSession } from '@/lib/auth'

type AuthUser = { id: string; email: string }

type AuthContextValue = {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentSession = getBackendSession()
    setSession(currentSession)
    setUser(currentSession?.user ?? null)
    setLoading(false)

    // Handle storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anyx.auth.session') {
        const newSession = getBackendSession()
        setSession(newSession)
        setUser(newSession?.user ?? null)
      }
    }

    // Handle auth changes in same tab (storage event doesn't fire in same tab)
    const handleAuthChange = (e: CustomEvent) => {
      const newSession = e.detail
      setSession(newSession)
      setUser(newSession?.user ?? null)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth-session-change', handleAuthChange as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-session-change', handleAuthChange as EventListener)
    }
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
    setSession(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ user, session, loading, signOut }), [user, session, loading, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


