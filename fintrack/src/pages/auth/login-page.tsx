import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ChartNoAxesCombined,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
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
    <div className="flex items-center gap-3" aria-label="FinTrack">
      <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#2459e9] text-white shadow-[0_7px_17px_-7px_rgba(37,99,235,0.6)]">
        <ChartNoAxesCombined className="size-[23px]" strokeWidth={2.3} aria-hidden="true" />
      </div>
      <div>
        <p className="text-[21px] font-bold leading-none tracking-[-0.055em] text-[#17233f]">
          fin<span className="text-[#2459e9]">track</span>
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.21em] text-[#8a96ab]">
          Seu controle financeiro
        </p>
      </div>
    </div>
  )
}

function LoginIllustration() {
  return (
    <aside
      className="relative hidden min-w-0 overflow-hidden rounded-[28px] bg-[linear-gradient(146deg,#f0f6ff_0%,#e8f0ff_51%,#d9e7ff_100%)] lg:flex"
      aria-label="Conheça o FinTrack"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-[490px] rounded-full bg-[#c4d8ff]/55 blur-[65px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-24 size-[460px] rounded-full bg-white/65 blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#7ea0e4_0.7px,transparent_0.7px)] [background-size:22px_22px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[680px] flex-col justify-center px-8 py-14 xl:px-14 2xl:px-[72px]">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#d1def6] bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#4266af] shadow-sm">
          <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Mais clareza para o seu dia a dia
        </div>

        <h2 className="max-w-[560px] text-[clamp(2.1rem,3.25vw,3.65rem)] font-semibold leading-[1.09] tracking-[-0.055em] text-[#17284a]">
          Suas finanças.
          <br />
          <span className="text-[#2658e8]">Seu próximo passo.</span>
        </h2>
        <p className="mt-5 max-w-[490px] text-[15px] leading-7 text-[#687a9b] xl:text-base">
          Uma visão simples do seu dinheiro, das suas metas e de tudo o que você quer construir.
        </p>

        <div className="relative mt-10 w-full rounded-[26px] border border-white/90 bg-white/90 p-5 shadow-[0_32px_80px_-28px_rgba(49,88,161,0.24)] backdrop-blur-sm xl:mt-12 xl:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-[-0.015em] text-[#1d2d4a]">
                Seu panorama financeiro
              </p>
              <p className="mt-1 text-xs text-[#93a0b5]">
                Tudo organizado em um só lugar
              </p>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-[#2459e9]">
              <ChartNoAxesCombined className="size-[18px]" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {[
              { label: 'Receitas', fill: 'bg-[#dce8ff]', width: 'w-[70%]', dot: 'bg-[#4d80f5]' },
              { label: 'Despesas', fill: 'bg-[#f9e4e7]', width: 'w-[49%]', dot: 'bg-[#e78d9a]' },
              { label: 'Objetivos', fill: 'bg-[#dff3ed]', width: 'w-[85%]', dot: 'bg-[#5fbba2]' },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-[15px] border border-[#edf1fa] bg-[#fafcff] px-3 py-3.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className={'size-1.5 shrink-0 rounded-full ' + item.dot} />
                  <span className="truncate text-[10px] font-medium text-[#73819a] xl:text-xs">
                    {item.label}
                  </span>
                </div>
                <div className={'mt-3 h-2.5 rounded-full ' + item.fill}>
                  <div className={'h-full rounded-full ' + item.width + ' ' + item.dot} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[18px] border border-[#edf1fa] bg-white px-4 pb-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#35435e]">Evolução financeira</span>
              <span className="text-[10px] text-[#a0acc0]">Visão ilustrativa</span>
            </div>

            <div className="relative mt-3 h-[145px] overflow-hidden sm:h-[155px]">
              <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between py-3">
                {[0, 1, 2, 3].map((line) => (
                  <div key={line} className="w-full border-t border-dashed border-[#e9eef9]" />
                ))}
              </div>
              <svg
                viewBox="0 0 460 150"
                preserveAspectRatio="none"
                role="img"
                aria-label="Ilustração de gráfico de evolução financeira"
                className="relative h-full w-full"
              >
                <defs>
                  <linearGradient id="fintrack-login-graph-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f84f7" stopOpacity="0.23" />
                    <stop offset="100%" stopColor="#4f84f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 127 C45 126 56 98 98 103 S145 115 184 85 S242 99 290 58 S359 71 405 33 S444 28 460 15 V150 H0 Z"
                  fill="url(#fintrack-login-graph-fill)"
                />
                <path
                  d="M0 127 C45 126 56 98 98 103 S145 115 184 85 S242 99 290 58 S359 71 405 33 S444 28 460 15"
                  stroke="#3b72ee"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="405" cy="33" r="6" fill="#3b72ee" stroke="white" strokeWidth="3" />
              </svg>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff5ff] px-3 py-1.5 text-[11px] font-medium text-[#496cb9]">
              <Check className="size-3.5" aria-hidden="true" /> Organização
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff8f5] px-3 py-1.5 text-[11px] font-medium text-[#439780]">
              <Check className="size-3.5" aria-hidden="true" /> Planejamento
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f2ff] px-3 py-1.5 text-[11px] font-medium text-[#796bb4]">
              <Check className="size-3.5" aria-hidden="true" /> Tranquilidade
            </span>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-3 text-[#6c7fa6]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d0ddf7] bg-white/75">
            <Wallet className="size-4 text-[#426fce]" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium leading-5">
            Simples para começar. Completo para evoluir.
          </span>
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
    <main className="min-h-[100dvh] bg-[#f7f9fd] font-sans text-[#1d2c48]">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1800px] lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)] lg:gap-3 lg:p-3">
        <section className="flex min-h-[100dvh] flex-col bg-white px-6 sm:px-10 lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[28px] lg:border lg:border-[#edf0f6] lg:px-10 xl:px-16 2xl:px-24">
          <header className="flex items-center justify-between gap-3 py-7 sm:py-9">
            <FinTrackBrand />
            <div className="hidden items-center gap-1.5 rounded-full border border-[#e6ebf3] bg-[#f8faff] px-3 py-2 text-[11px] font-medium text-[#7c8ba3] sm:inline-flex">
              <ShieldCheck className="size-3.5 text-[#3973e5]" aria-hidden="true" />
              Acesso protegido
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
            <div className="w-full max-w-[420px]">
              <div className="mb-6 flex size-12 items-center justify-center rounded-[17px] border border-[#dfe9ff] bg-[#eff5ff] text-[#2459e9] shadow-[0_8px_25px_-20px_rgba(37,99,235,0.5)]">
                <Fingerprint className="size-[24px]" strokeWidth={1.9} aria-hidden="true" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#3468d8]">
                Seu espaço financeiro
              </p>
              <h1 className="mt-3 text-[clamp(2rem,3vw,2.65rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-[#14223b]">
                Bem-vindo de volta.
              </h1>
              <p className="mt-3 max-w-[360px] text-[15px] leading-6 text-[#78869c]">
                Entre na sua conta e continue cuidando das suas finanças com clareza.
              </p>

              <form className="mt-9 space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[13px] font-semibold text-[#33425d]">
                    E-mail
                  </Label>
                  <div className="flex h-[52px] items-center gap-3 rounded-[15px] border border-[#dde5f1] bg-[#fcfdff] px-4 shadow-[0_2px_4px_rgba(26,45,78,0.015)] transition-[border-color,box-shadow] focus-within:border-[#7ba4f7] focus-within:ring-[3px] focus-within:ring-[#e7f0ff]">
                    <Mail className="size-[18px] shrink-0 text-[#9ba9bd]" strokeWidth={1.9} aria-hidden="true" />
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
                      className="h-full min-w-0 border-0 bg-transparent px-0 text-[15px] text-[#22314c] shadow-none outline-none placeholder:text-[#b2bdcd] focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:text-[#22314c]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[13px] font-semibold text-[#33425d]">
                    Senha
                  </Label>
                  <div className="flex h-[52px] items-center gap-3 rounded-[15px] border border-[#dde5f1] bg-[#fcfdff] px-4 shadow-[0_2px_4px_rgba(26,45,78,0.015)] transition-[border-color,box-shadow] focus-within:border-[#7ba4f7] focus-within:ring-[3px] focus-within:ring-[#e7f0ff]">
                    <LockKeyhole className="size-[18px] shrink-0 text-[#9ba9bd]" strokeWidth={1.9} aria-hidden="true" />
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
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-[15px] text-[#22314c] shadow-none outline-none placeholder:text-[#b2bdcd] focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:text-[#22314c]"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#8191ab] transition-colors hover:bg-[#edf3ff] hover:text-[#2459e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ba4f7]"
                    >
                      {showPassword ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <div
                    id="login-error"
                    role="alert"
                    className="flex items-start gap-2.5 rounded-[13px] border border-[#ffdadc] bg-[#fff4f4] px-3.5 py-3 text-[13px] leading-5 text-[#bc424c]"
                  >
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="mt-2 h-[52px] w-full gap-2 rounded-[15px] border border-[#2459e9] bg-[#2459e9] px-5 text-[15px] font-semibold text-white shadow-[0_12px_23px_-13px_rgba(37,99,235,0.75)] transition-[background-color,box-shadow,transform] hover:bg-[#174bd3] hover:shadow-[0_15px_27px_-13px_rgba(37,99,235,0.75)] focus-visible:ring-[#9bbaff] disabled:opacity-65"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar na minha conta
                      <ArrowRight className="size-[18px]" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 flex items-start gap-3 rounded-[16px] border border-[#e9eef8] bg-[#f8faff] px-4 py-3.5">
                <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-[#356be1]" aria-hidden="true" />
                <p className="text-xs leading-5 text-[#74839c]">
                  Acesso reservado à sua conta. Seus dados financeiros ficam protegidos pela autenticação do FinTrack.
                </p>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#f0f2f6] py-5 text-[11px] text-[#97a3b5] sm:py-6">
            <span>© {new Date().getFullYear()} FinTrack</span>
            <span>Organize hoje. Planeje amanhã.</span>
          </footer>
        </section>

        <LoginIllustration />
      </div>
    </main>
  )
}
