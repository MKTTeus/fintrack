import { useState, type FormEvent } from 'react'

import {
  Lock,
  Mail,
  Shield,
  Info,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
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

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_20%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.06),transparent_24%)]" />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1200px] flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="hidden flex-col gap-6 lg:flex">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.8)] ring-1 ring-slate-500/15">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <TrendingUp className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-300/80">
                    FinTrack
                  </p>
                  <p className="text-lg font-semibold text-slate-100">
                    Controle financeiro inteligente
                  </p>
                </div>
              </div>

              <div className="max-w-xl space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Gerencie suas finanças com clareza e segurança.
                </h1>
                <p className="max-w-lg text-base leading-7 text-slate-400">
                  Acompanhe receitas, despesas, metas e relatórios em um só lugar.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-3.5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.85)] ring-1 ring-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Metas e objetivos</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Defina e acompanhe suas metas financeiras.</p>
                </div>
              </div>

              <div className="flex gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-3.5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.85)] ring-1 ring-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <Info className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Relatórios inteligentes</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Insights claros para decisões mais estratégicas.</p>
                </div>
              </div>

              <div className="flex gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-3.5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.85)] ring-1 ring-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Segurança e privacidade</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Seus dados protegidos com autenticação segura.</p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-500 ring-1 ring-white/5 lg:flex">
              <ShieldCheck className="size-4 text-blue-300" />
              <span>Acesso controlado por convite</span>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <Card className="w-full max-w-[560px] rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-4 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.88)] ring-1 ring-white/5 backdrop-blur-xl">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <TrendingUp className="size-5" />
                </div>

                <div className="text-center">
                  <p className="text-2xl font-semibold tracking-tight text-white">Entrar no FinTrack</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Acesse sua conta para continuar.</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 px-3 py-2.5 focus-within:border-blue-400/60 focus-within:ring-1 focus-within:ring-blue-400/20">
                      <Mail className="size-5 text-slate-400" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Digite seu email"
                        className="border-0 bg-transparent p-0 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 px-3 py-2.5 focus-within:border-blue-400/60 focus-within:ring-1 focus-within:ring-blue-400/20">
                      <Lock className="size-5 text-slate-400" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Digite sua senha"
                        className="border-0 bg-transparent p-0 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none"
                      />
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errorMessage}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl px-4 text-base font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <div className="rounded-3xl border border-blue-500/20 bg-slate-950/85 p-4 ring-1 ring-blue-500/10">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                    <Info className="size-4" />
                    <span>Se quiser fazer um teste entre com esse email e senha</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-medium text-slate-100">demo@fintrack.com</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                      <span className="text-slate-400">Senha:</span>
                      <span className="font-medium text-slate-100">demo123</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="size-4 text-blue-300" />
                  <span>Acesso seguro e monitorado</span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
