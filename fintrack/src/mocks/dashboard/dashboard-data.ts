import type {
  BalanceChartData,
  ExpenseChartData,
  Metric,
  Transaction,
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

export const transactions: Transaction[] = [
  {
    title: 'Supermercado',
    category: 'Alimentação',
    value: '-R$ 240',
    expense: true,
  },

  {
    title: 'Salário',
    category: 'Receita',
    value: '+R$ 4.500',
    expense: false,
  },

  {
    title: 'Uber',
    category: 'Transporte',
    value: '-R$ 32',
    expense: true,
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