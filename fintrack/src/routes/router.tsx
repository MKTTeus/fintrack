import {
  createBrowserRouter,
} from 'react-router-dom'

import { DashboardPage } from '@/pages/dashboard/dashboard-page'

import { GoalsPage } from '@/pages/goals/goals-page'

import { ReportsPage } from '@/pages/reports/reports-page'

import { SettingsPage } from '@/pages/settings/settings-page'

import { TransactionsPage } from '@/pages/transactions/transactions-page'

import { WalletsPage } from '@/pages/wallets/wallets-page'

import { LoginPage } from '@/pages/auth/login-page'

export const router = createBrowserRouter([
  {
  path: '/login',
  element: <LoginPage />,
  },

  {
    path: '/',
    element: <DashboardPage />,
  },

  {
    path: '/transactions',
    element: <TransactionsPage />,
  },

  {
    path: '/wallets',
    element: <WalletsPage />,
  },

  {
    path: '/goals',
    element: <GoalsPage />,
  },

  {
    path: '/reports',
    element: <ReportsPage />,
  },

  {
    path: '/settings',
    element: <SettingsPage />,
  },
])