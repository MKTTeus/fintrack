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
