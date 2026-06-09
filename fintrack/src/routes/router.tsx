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
import { ProtectedRoute } from '@/routes/protected-route'

export const router = createBrowserRouter([
  {
  path: '/login',
  element: <LoginPage />,
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <TransactionsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/wallets',
    element: (
      <ProtectedRoute>
        <WalletsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/goals',
    element: (
      <ProtectedRoute>
        <GoalsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
])
