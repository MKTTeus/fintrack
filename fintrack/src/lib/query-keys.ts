export const queryKeys = {
  transactions: {
    list: ['transactions', 'list'] as const,
    details: (id: string) =>
      ['transactions', 'details', id] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
    metrics: ['dashboard', 'summary'] as const,
    expensesChart: ['dashboard', 'expenses-chart'] as const,
    balanceChart: ['dashboard', 'balance-chart'] as const,
    recentTransactions: [
      'dashboard',
      'recent-transactions',
    ] as const,
  },
}
