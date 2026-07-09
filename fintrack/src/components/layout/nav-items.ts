import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Settings,
  Target,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const navItems: {
  icon: LucideIcon
  label: string
  href: string
}[] = [
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
