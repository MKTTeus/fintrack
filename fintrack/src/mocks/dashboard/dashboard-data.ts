import type {
  BalanceChartData,
  DashboardTransaction,
  ExpenseChartData,
  Metric,
} from '@/types/dashboard'

export const metrics: Metric[] = [
  {
    title: 'Saldo Total',
    value: 'R$ 24.580',
    change: '+8% este mês',
  },

  {
    title: 'Receitas',
    value: 'R$ 12.450',
    change: '+12% este mês',
    variant: 'income',
  },

  {
    title: 'Despesas',
    value: 'R$ 4.320',
    change: '-3% este mês',
    variant: 'expense',
  },
]

export const transactions: DashboardTransaction[] = [
  {
    id: 'dashboard-transaction-1',
    title: 'Supermercado',
    category: 'Alimentação',
    amount: 240,
    type: 'expense',
    transaction_date: '2026-06-03',
  },

  {
    id: 'dashboard-transaction-2',
    title: 'Salário',
    category: 'Receita',
    amount: 4500,
    type: 'income',
    transaction_date: '2026-06-01',
  },

  {
    id: 'dashboard-transaction-3',
    title: 'Uber',
    category: 'Transporte',
    amount: 32,
    type: 'expense',
    transaction_date: '2026-06-02',
  },
]

export const expensesChartData: ExpenseChartData[] =
  [
    {
      month: 'Jan',
      income: 8200,
      expense: 4300,
    },

    {
      month: 'Fev',
      income: 9100,
      expense: 5200,
    },

    {
      month: 'Mar',
      income: 8600,
      expense: 4900,
    },

    {
      month: 'Abr',
      income: 10200,
      expense: 6100,
    },

    {
      month: 'Mai',
      income: 11800,
      expense: 7200,
    },

    {
      month: 'Jun',
      income: 12450,
      expense: 4320,
    },
  ]

export const balanceChartData: BalanceChartData[] =
  [
    {
      month: 'Jan',
      balance: 4200,
    },

    {
      month: 'Fev',
      balance: 6800,
    },

    {
      month: 'Mar',
      balance: 7400,
    },

    {
      month: 'Abr',
      balance: 8900,
    },

    {
      month: 'Mai',
      balance: 12100,
    },

    {
      month: 'Jun',
      balance: 24580,
    },
  ]
