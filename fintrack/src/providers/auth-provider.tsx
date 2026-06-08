import {
createContext,
useContext,
useEffect,
useState,
} from 'react'

import type {
Session,
User,
} from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

interface AuthContextType {
user: User | null
session: Session | null
loading: boolean
}

const AuthContext =
createContext<AuthContextType | null>(null)

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
async function loadSession() {
const response =
await supabase.auth.getSession()

  const session =
    response.data.session

  setSession(session)

  setUser(session?.user ?? null)

  setLoading(false)
}

loadSession()

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setSession(session)

    setUser(session?.user ?? null)
  }
)

return () => {
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

export function useAuth() {
const context = useContext(AuthContext)

if (!context) {
throw new Error(
'useAuth must be used within AuthProvider'
)
}

return context
}
