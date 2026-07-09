export const queryKeys = {
  transactions: {
    list: ['transactions', 'list'] as const,
    details: (id: string) =>
      ['transactions', 'details', id] as const,
  },
  wallets: {
    list: ['wallets', 'list'] as const,
    details: (id: string) =>
      ['wallets', 'details', id] as const,
  },
  creditCards: {
    list: ['credit-cards', 'list'] as const,
    details: (id: string) =>
      ['credit-cards', 'details', id] as const,
  },
  goals: {
    list: ['goals', 'list'] as const,
    details: (id: string) =>
      ['goals', 'details', id] as const,
  },
  reports: {
    data: (filters: {
      category: string
      customEndDate?: string
      customStartDate?: string
      period: string
      type: string
      walletId: string
    }) => ['reports', 'data', filters] as const,
  },
  userSettings: {
    details: ['user-settings', 'details'] as const,
  },
  goalDeposits: {
    list: ['goal-deposits', 'list'] as const,
    byGoal: (goalId: string) =>
      ['goal-deposits', 'list', goalId] as const,
    details: (id: string) =>
      ['goal-deposits', 'details', id] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
    metrics: ['dashboard', 'metrics'] as const,
    expensesChart: ['dashboard', 'expenses-chart'] as const,
    balanceChart: ['dashboard', 'balance-chart'] as const,
    recentTransactions: [
      'dashboard',
      'recent-transactions',
    ] as const,
  },
}
