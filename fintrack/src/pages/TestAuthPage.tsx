import { useState } from 'react'

import { signUp } from '@/services/auth/auth.service'

export function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignUp() {
    try {
      const data = await signUp(email, password)

      console.log('Usuário criado:', data)

      alert('Usuário criado com sucesso!')
    } catch (error) {
      console.error(error)

      alert('Erro ao criar usuário')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <input
          className="rounded border p-2"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded border p-2"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="rounded bg-black p-2 text-white"
          onClick={handleSignUp}
        >
          Criar conta
        </button>
      </div>
    </div>
  )
}