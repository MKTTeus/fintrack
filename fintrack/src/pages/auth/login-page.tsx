import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

function loginErrorMessage(message: string): string {
  const error = message.toLowerCase()

  if (error.includes('invalid login credentials') || error.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos. Confira os dados e tente novamente.'
  }
  if (error.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de acessar sua conta.'
  }
  if (error.includes('too many requests') || error.includes('rate limit')) {
    return 'Muitas tentativas de acesso. Aguarde um pouco antes de tentar novamente.'
  }

  return 'Não foi possível entrar agora. Confira sua conexão e tente novamente.'
}

function FinTrackBrand() {
  return (
    <div className="flex items-center gap-2.5" aria-label="FinTrack">
      <img
        src="/fintrack-logo.svg"
        alt=""
        width={38}
        height={38}
        className="size-[38px] shrink-0 object-contain"
      />
      <div>
        <p className="text-[20px] font-bold leading-none tracking-[-0.06em] text-[#14233e]">
          fin<span className="text-[#2463f3]">track</span>
        </p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8694ab]">
          Controle financeiro
        </p>
      </div>
    </div>
  )
}

/** Illustrative design only: never show made-up financial balances as real data. */
function LoginPreview() {
  return (
    <aside
      className="relative hidden min-w-0 overflow-hidden rounded-[22px] border border-[#deebff] bg-[linear-gradient(145deg,#eef5ff_0%,#e7f0ff_52%,#d9e9ff_100%)] lg:flex"
      aria-label="Conheça o FinTrack"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[360px] rounded-full bg-white/50 blur-[65px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-28 size-[370px] rounded-full bg-[#b9d5ff]/45 blur-[60px]"
      />

      <div className="relative m-auto w-full max-w-[480px] px-6 py-6 xl:px-9">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d3e2fb] bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-[#3d65af]">
          <span className="size-1.5 rounded-full bg-[#2463f3]" />
          Organize com simplicidade
        </div>

        <h2 className="max-w-[400px] text-[clamp(1.7rem,2.3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.05em] text-[#183052]">
          Seu dinheiro mais claro.
          <br />
          <span className="text-[#2463f3]">Suas metas mais perto.</span>
        </h2>
        <p className="mt-3 max-w-[365px] text-[13px] leading-[1.6] text-[#7184a3]">
          Receitas, despesas e objetivos em uma visão simples para acompanhar o que importa.
        </p>

        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e1eafa] bg-white p-5 shadow-[0_20px_45px_-26px_rgba(50,96,161,0.32)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-[#273c5e]">Visão financeira</p>
              <p className="mt-1 text-[11px] text-[#9aaac0]">Um jeito melhor de acompanhar</p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf4ff] text-[#2463f3]">
              <Wallet className="size-4" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { name: 'Receitas', bar: 'w-[73%]', tone: 'bg-[#4784f9]', bg: 'bg-[#e9f1ff]' },
              { name: 'Despesas', bar: 'w-[46%]', tone: 'bg-[#ee999d]', bg: 'bg-[#fff0f1]' },
              { name: 'Metas', bar: 'w-[84%]', tone: 'bg-[#55baa2]', bg: 'bg-[#e9f8f3]' },
            ].map((item) => (
              <div key={item.name} className="min-w-0 rounded-[12px] border border-[#eef2f9] bg-[#fbfcff] px-2.5 py-3">
                <p className="truncate text-[10px] font-medium text-[#7284a1]">{item.name}</p>
                <div className={'mt-3 h-1.5 rounded-full ' + item.bg}>
                  <div className={'h-full rounded-full ' + item.bar + ' ' + item.tone} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[13px] border border-[#eef2f9] bg-[#fcfdff] px-3.5 pb-3 pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-[#50627d]">Evolução ao longo do tempo</p>
              <span className="text-[9px] text-[#a8b5c8]">Ilustração</span>
            </div>
            <svg
              viewBox="0 0 360 100"
              preserveAspectRatio="none"
              role="img"
              aria-label="Gráfico ilustrativo de evolução"
              className="mt-2 block h-[96px] w-full"
            >
              <defs>
                <linearGradient id="fintrack-login-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c83fa" stopOpacity="0.23" />
                  <stop offset="100%" stopColor="#4c83fa" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 90 H360 M0 57 H360 M0 25 H360" stroke="#e9eff9" strokeDasharray="4 5" fill="none" />
              <path d="M0 84 C28 80 42 59 70 68 S111 83 146 59 S185 73 220 45 S266 51 300 27 S340 30 360 12 V100 H0Z" fill="url(#fintrack-login-area)" />
              <path d="M0 84 C28 80 42 59 70 68 S111 83 146 59 S185 73 220 45 S266 51 300 27 S340 30 360 12" fill="none" stroke="#3975f3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="300" cy="27" r="4.5" fill="#3975f3" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#6480ac]">
          <span className="flex size-7 items-center justify-center rounded-full border border-[#d8e6fc] bg-white/80 text-[#2463f3]">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          Organize hoje. Planeje amanhã.
        </div>
      </div>
    </aside>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMessage(loginErrorMessage(error.message))
        return
      }

      navigate('/', { replace: true })
    } catch {
      setErrorMessage('Não foi possível conectar ao FinTrack. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[100dvh] min-w-0 bg-white font-sans text-[#1d2c48] lg:flex lg:items-center lg:justify-center lg:bg-[#f5f8fd] lg:p-4 xl:p-6">
      <div className="mx-auto grid min-h-[100dvh] min-w-0 w-full max-w-[1100px] grid-cols-1 lg:min-h-[590px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-4">
        <section className="flex min-h-[100dvh] min-w-0 flex-col bg-white px-4 sm:px-9 lg:min-h-0 lg:rounded-[22px] lg:border lg:border-[#e9edf6] lg:px-9 xl:px-[52px]">
          <header className="flex items-center justify-between gap-3 pb-5 pt-6 sm:pt-8 lg:pb-4">
            <FinTrackBrand />
            <div className="hidden items-center gap-1.5 rounded-full border border-[#e8edf7] bg-[#f7faff] px-2.5 py-1.5 text-[10px] font-medium text-[#798ca8] sm:inline-flex">
              <ShieldCheck className="size-3.5 text-[#2463f3]" aria-hidden="true" />
              Acesso protegido
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center py-6 sm:py-9 lg:py-4">
            <div className="w-full max-w-[375px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3473e9]">
                Sua área financeira
              </p>
              <h1 className="mt-2.5 text-[clamp(1.75rem,2.6vw,2.15rem)] font-semibold leading-[1.13] tracking-[-0.05em] text-[#182a46]">
                Bem-vindo de volta.
              </h1>
              <p className="mt-2 max-w-[330px] text-[13px] leading-[1.6] text-[#7b899f] sm:text-sm">
                Entre na sua conta para continuar acompanhando suas finanças.
              </p>

              <form className="mt-7 space-y-[18px]" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-semibold text-[#344660]">
                    E-mail
                  </Label>
                  <div className="flex h-[48px] items-center gap-2.5 rounded-[13px] border border-[#dfe6f1] bg-[#fcfdff] px-3.5 transition-[border-color,box-shadow] focus-within:border-[#7ca7fa] focus-within:ring-[3px] focus-within:ring-[#ebf2ff]">
                    <Mail className="size-[17px] shrink-0 text-[#98a7bc]" aria-hidden="true" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      maxLength={254}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      aria-invalid={Boolean(errorMessage)}
                      aria-describedby={errorMessage ? 'login-error' : undefined}
                      placeholder="seuemail@exemplo.com"
                      className="h-full min-w-0 border-0 bg-transparent px-0 text-[14px] text-[#22314c] shadow-none outline-none placeholder:text-[#a9b5c6] focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:text-[#22314c]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-semibold text-[#344660]">
                    Senha
                  </Label>
                  <div className="flex h-[48px] items-center gap-2.5 rounded-[13px] border border-[#dfe6f1] bg-[#fcfdff] px-3.5 transition-[border-color,box-shadow] focus-within:border-[#7ca7fa] focus-within:ring-[3px] focus-within:ring-[#ebf2ff]">
                    <LockKeyhole className="size-[17px] shrink-0 text-[#98a7bc]" aria-hidden="true" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      aria-invalid={Boolean(errorMessage)}
                      aria-describedby={errorMessage ? 'login-error' : undefined}
                      placeholder="Digite sua senha"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-[14px] text-[#22314c] shadow-none outline-none placeholder:text-[#a9b5c6] focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:text-[#22314c]"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#8191ab] transition-colors hover:bg-[#edf3ff] hover:text-[#2463f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ba4f7]"
                    >
                      {showPassword ? (
                        <EyeOff className="size-[18px]" aria-hidden="true" />
                      ) : (
                        <Eye className="size-[18px]" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <div
                    id="login-error"
                    role="alert"
                    className="flex items-start gap-2.5 rounded-[12px] border border-[#ffdadc] bg-[#fff4f4] px-3.5 py-3 text-xs leading-5 text-[#bc424c]"
                  >
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="h-[48px] w-full gap-2 rounded-[13px] border border-[#2463f3] bg-[#2463f3] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(36,99,243,0.8)] transition-[background-color,box-shadow] hover:bg-[#1c52d7] focus-visible:ring-[#a0bfff] disabled:opacity-65"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar na conta
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-7 flex items-start gap-2.5 rounded-[13px] border border-[#edf1f8] bg-[#f9fbff] px-3.5 py-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#3871e8]" aria-hidden="true" />
                <p className="text-[11px] leading-[1.65] text-[#8090a7]">
                  Seus dados financeiros são protegidos pelo acesso à sua conta.
                </p>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[#f0f2f7] py-4 text-[10px] text-[#9caabc]">
            <span>© {new Date().getFullYear()} FinTrack</span>
            <span>Organize hoje. Planeje amanhã.</span>
          </footer>
        </section>

        <LoginPreview />
      </div>
    </main>
  )
}
