import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

export function LoginPage() {
const navigate = useNavigate()

const [email, setEmail] = useState('')

const [password, setPassword] = useState('')

const [errorMessage, setErrorMessage] =
useState<string | null>(null)

const [loading, setLoading] = useState(false)

async function handleLogin() {
setLoading(true)
setErrorMessage(null)

const { error } =
await supabase.auth.signInWithPassword({
email: email.trim(),
password: password.trim(),
})

if (error) {
setErrorMessage(error.message)
setLoading(false)
return
}

navigate('/', { replace: true })
}

async function handleSignup() {
setLoading(true)
setErrorMessage(null)

const { error } =
await supabase.auth.signUp({
email: email.trim(),
password: password.trim(),
})

if (error) {
setErrorMessage(error.message)
setLoading(false)
return
}

navigate('/', { replace: true })
}


return ( <div className="flex min-h-screen items-center justify-center"> <div className="flex w-full max-w-sm flex-col gap-4">
<input
className="rounded border p-3"
placeholder="Email"
value={email}
onChange={(e) =>
setEmail(e.target.value)
}
/>

    <input
      className="rounded border p-3"
      placeholder="Senha"
      type="password"
      value={password}
      onChange={(e) =>
        setPassword(e.target.value)
      }
    />

    <button
      className="rounded bg-blue-500 p-3 text-white"
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? 'Entrando...' : 'Login'}
    </button>

    <button
      className="rounded border p-3"
      onClick={handleSignup}
      disabled={loading}
    >
      Criar conta
    </button>

    {errorMessage ? (
      <p className="text-sm text-destructive">
        {errorMessage}
      </p>
    ) : null}
  </div>
</div>

)
}
