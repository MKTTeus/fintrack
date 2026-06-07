import { Bell } from 'lucide-react'

import { useLocation } from 'react-router-dom'

const pageData = {
  '/': {
    title: 'Boa noite, Matheus',
    description:
      'Acompanhe suas finanças em tempo real',
  },

  '/transactions': {
    title: 'Transações',
    description:
      'Gerencie suas movimentações financeiras',
  },

  '/wallets': {
    title: 'Carteiras',
    description:
      'Visualize suas contas e saldos',
  },

  '/goals': {
    title: 'Metas',
    description:
      'Acompanhe seus objetivos financeiros',
  },

  '/reports': {
    title: 'Relatórios',
    description:
      'Analise seu desempenho financeiro',
  },

  '/settings': {
    title: 'Configurações',
    description:
      'Personalize sua experiência',
  },
}

export function AppHeader() {
  const location = useLocation()

  const currentPage =
    pageData[
      location.pathname as keyof typeof pageData
    ] ?? pageData['/']

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[80px]
        items-center
        justify-between
        border-b
        border-border
        bg-background/80
        px-8
        backdrop-blur-xl
      "
    >
      {/* Left */}
      <div>
        <h2
          className="
            text-2xl
            font-medium
            tracking-tight
          "
        >
          {currentPage.title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          {currentPage.description}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          className="
            relative
            flex
            size-11
            items-center
            justify-center
            rounded-2xl
            border
            border-border
            bg-card
            transition-all
            hover:bg-accent
          "
        >
          <Bell className="size-5" />

          <span
            className="
              absolute
              right-2
              top-2
              size-2
              rounded-full
              bg-primary
            "
          />
        </button>

        <div
          className="
            flex
            size-11
            items-center
            justify-center
            rounded-full
            bg-primary
            text-sm
            font-medium
            text-primary-foreground
            shadow-lg
            shadow-primary/20
          "
        >
          M
        </div>
      </div>
    </header>
  )
}