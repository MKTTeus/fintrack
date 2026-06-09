import {
useEffect,
useState,
} from 'react'

import { supabase } from '@/lib/supabase'
import { AuthContext } from '@/providers/auth-context'

import type {
  Session,
  User,
} from '@supabase/supabase-js'

interface AuthProviderProps {
children: React.ReactNode
}

export function AuthProvider({
children,
}: AuthProviderProps) {
const [session, setSession] =
useState<Session | null>(null)

const [user, setUser] =
useState<User | null>(null)

const [loading, setLoading] =
useState(true)

useEffect(() => {
let mounted = true

async function loadSession() {
const { data, error } =
  await supabase.auth.getSession()

if (!mounted) {
  return
}

if (error) {
  setSession(null)
  setUser(null)
  setLoading(false)
  return
}

  const session =
    data.session

  setSession(session)

  setUser(session?.user ?? null)

  setLoading(false)
}

loadSession()

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(
  (_event, session) => {
    if (!mounted) {
      return
    }

    setSession(session)

    setUser(session?.user ?? null)

    setLoading(false)
  }
)

return () => {
  mounted = false
  subscription.unsubscribe()
}

}, [])

return (
<AuthContext.Provider
value={{
user,
session,
loading,
}}
>
{children}
</AuthContext.Provider>
)
}
