import { Settings, User, type LucideIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import { navItems } from './nav-items'
import { useUserSettings } from '@/features/settings/hooks/use-user-settings'
import { useAuth } from '@/providers/auth-context'

type PageData = {
  icon?: LucideIcon
  title?: string
  description: string
}

const pageData: Record<string, PageData> = {
  '/': {
    description: 'Acompanhe suas finanças em tempo real',
  },

  '/transactions': {
    icon: navItems.find((item) => item.href === '/transactions')?.icon,
    title: 'Transações',
    description: 'Gerencie suas movimentações financeiras',
  },

  '/wallets': {
    icon: navItems.find((item) => item.href === '/wallets')?.icon,
    title: 'Carteiras',
    description: 'Visualize suas contas e saldos',
  },

  '/investments': {
    icon: navItems.find((item) => item.href === '/investments')?.icon,
    title: 'Investimentos',
    description: 'Acompanhe aplicações, resgates e rendimentos registrados',
  },

  '/goals': {
    icon: navItems.find((item) => item.href === '/goals')?.icon,
    title: 'Metas',
    description: 'Acompanhe seus objetivos financeiros',
  },

  '/reports': {
    icon: navItems.find((item) => item.href === '/reports')?.icon,
    title: 'Relatórios',
    description: 'Analise seu desempenho financeiro',
  },

  '/settings': {
    icon: navItems.find((item) => item.href === '/settings')?.icon,
    title: 'Configurações',
    description: 'Personalize sua experiência',
  },
}

function getGreetingByHour(date: Date) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) {
    return 'Bom dia'
  }

  if (hour >= 12 && hour < 18) {
    return 'Boa tarde'
  }

  return 'Boa noite'
}

export function AppHeader() {
  const location = useLocation()
  const { data: settings } = useUserSettings()
  const { user } = useAuth()

  const pathname =
    location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '')

  const currentPage =
    pageData[pathname as keyof typeof pageData] ?? pageData['/']

  const displayName =
    settings?.display_name ??
    user?.email?.split('@')[0] ??
    'Usuário'

  const title =
    pathname === '/'
      ? `${getGreetingByHour(new Date())}, ${displayName}`
      : currentPage.title ?? ''

  const Icon = currentPage.icon

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        min-h-[72px]
        items-center
        justify-between
        border-b
        border-border
        bg-background/90
        px-3
        backdrop-blur-xl
        transition-all
        duration-200
        sm:min-h-[80px]
        sm:px-6
      "
    >
      {/* Left */}
      <div className="min-w-0 flex-1 py-3 pr-3">
        <h2
          className="
            text-lg sm:text-2xl
            font-semibold
            tracking-tight
          "
        >
          {Icon ? (
            <span className="inline-flex min-w-0 items-center gap-2">
              <Icon className="size-5 shrink-0" />
              {title}
            </span>
          ) : (
            title
          )}
        </h2>

        <p
          className="
            mt-1
            text-xs sm:text-sm
            text-muted-foreground
          "
        >
          {currentPage.description}
        </p>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NavLink
          to="/settings"
          className="
            inline-flex
            h-9
            w-9
            sm:h-11
            sm:w-11
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-card
            text-muted-foreground
            transition-colors
            duration-150
            hover:text-foreground
            lg:hidden
          "
          aria-label="Configurações"
        >
          <Settings className="size-5" />
        </NavLink>

        <div
          className="
            flex
            size-9 sm:size-11
            items-center
            justify-center
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-lg
            shadow-primary/20
          "
        >
          <User className="size-5" />
        </div>
      </div>
    </header>
  )
}