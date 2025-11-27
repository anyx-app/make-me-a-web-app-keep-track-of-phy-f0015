import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase } from '@/sdk/supabase'
import { getSession as getBackendSession, signOut as authSignOut, type AuthSession } from '@/lib/auth'

const USE_BACKEND_AUTH = import.meta.env.VITE_USE_BACKEND_AUTH === 'true'

type AuthUser = User | { id: string; email: string }

type AuthContextValue = {
  user: AuthUser | null
  session: Session | AuthSession | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | AuthSession | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Backend auth mode (shared schema)
    if (USE_BACKEND_AUTH) {
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
    }

    // Native Supabase auth mode (dedicated instance)
    const supabase = getSupabase()
    if (!supabase) {
      if (isMounted) {
        setSession(null)
        setUser(null)
        setLoading(false)
      }
      return () => {
        isMounted = false
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    if (USE_BACKEND_AUTH) {
      await authSignOut()
      setSession(null)
      setUser(null)
      return
    }

    const supabase = getSupabase()
    if (supabase) {
      await supabase.auth.signOut()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ user, session, loading, signOut }), [user, session, loading, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


