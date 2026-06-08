import { useState } from 'react'

import { supabase } from '@/lib/supabase'

export function LoginPage() {
const [email, setEmail] = useState('')

const [password, setPassword] = useState('')

async function handleLogin() {
const { error } =
await supabase.auth.signInWithPassword({
email: email.trim(),
password: password.trim(),
})

if (error) {
console.error(error)
}
}

async function handleSignup() {
const { error } =
await supabase.auth.signUp({
email: email.trim(),
password: password.trim(),
})

if (error) {
console.error(error)
}
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
    >
      Login
    </button>

    <button
      className="rounded border p-3"
      onClick={handleSignup}
    >
      Criar conta
    </button>
  </div>
</div>

)
}
