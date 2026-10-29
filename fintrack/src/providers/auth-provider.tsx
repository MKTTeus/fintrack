import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { AuthContext } from './auth-context'

/** A single QueryClient is shared by the app: never show one user's cached finances to another. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient()
  const lastUserId = useRef<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let hasAuthEvent = false
    function applySession(next: Session | null) {
      if (!mounted) return
      const nextId = next?.user.id ?? null
      if (lastUserId.current !== nextId) {
        // Remove all financial and identity-scoped queries before exposing the new user.
        client.clear()
        lastUserId.current = nextId
      }
      setSession(next)
      setUser(next?.user ?? null)
      setLoading(false)
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      hasAuthEvent = true
      applySession(next)
    })
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!hasAuthEvent) applySession(error ? null : data.session)
    }).catch(() => {
      if (!hasAuthEvent) applySession(null)
    })
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [client])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
