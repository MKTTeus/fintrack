import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Settings,
  Target,
  Wallet,
} from 'lucide-react'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { NavLink } from 'react-router-dom'

const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/',
  },

  {
    icon: ArrowLeftRight,
    label: 'Transações',
    href: '/transactions',
  },

  {
    icon: Wallet,
    label: 'Carteiras',
    href: '/wallets',
  },

  {
    icon: Target,
    label: 'Metas',
    href: '/goals',
  },

  {
    icon: BarChart3,
    label: 'Relatórios',
    href: '/reports',
  },

  {
    icon: Settings,
    label: 'Configurações',
    href: '/settings',
  },
]

export function AppSidebar() {
  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-[280px]
        flex-col
        border-r
        border-border
        bg-card
        px-6
        py-6
      "
    >
      {/* Logo */}
      <div className="mb-10">
        <h1
          className="
            text-2xl
            font-medium
            tracking-tight
          "
        >
          Fintrack
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Controle financeiro inteligente
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? `
                        bg-primary/10
                        text-primary
                      `
                      : `
                        text-muted-foreground
                        hover:bg-accent
                        hover:text-foreground
                      `
                  }
                `
              }
            >
              <Icon className="size-5" />

              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        className="
          mt-auto
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-4
        "
      >
        <div>
          <p className="text-sm font-medium">
            Matheus
          </p>

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Fintrack User
          </p>
        </div>

        <ThemeToggle />
      </div>
    </aside>
  )
}