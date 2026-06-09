import type {
  BalanceChartData,
  ExpenseChartData,
} from '@/types/dashboard'

export interface Transaction {
  amount: number
  type: 'income' | 'expense'
  transaction_date: string
}

/**
 * Agregados transações por mês
 * Retorna objeto com { year-month: transactions[] }
 */
function aggregateByMonth(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  return transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.transaction_date)
      const yearMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`

      if (!acc[yearMonth]) {
        acc[yearMonth] = []
      }

      acc[yearMonth].push(transaction)
      return acc
    },
    {} as Record<string, Transaction[]>
  )
}

/**
 * Calcula receitas e despesas por mês
 * Retorna últimos 12 meses ou o período disponível
 */
export function calculateMonthlyExpenses(
  transactions: Transaction[]
): ExpenseChartData[] {
  const aggregated = aggregateByMonth(transactions)
  const sortedMonths = Object.keys(aggregated).sort()

  // Pegar últimos 12 meses
  const lastTwelveMonths = sortedMonths.slice(
    Math.max(0, sortedMonths.length - 12)
  )

  const monthLabels = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  return lastTwelveMonths.map((yearMonth) => {
    const monthTransactions = aggregated[yearMonth]
    const monthIndex = parseInt(yearMonth.split('-')[1]) - 1

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      month: monthLabels[monthIndex],
      income,
      expense,
    }
  })
}

/**
 * Calcula saldo cumulativo por mês
 * Começa do mês mais antigo e vai acumulando
 */
export function calculateCumulativeBalance(
  transactions: Transaction[]
): BalanceChartData[] {
  const aggregated = aggregateByMonth(transactions)
  const sortedMonths = Object.keys(aggregated).sort()

  // Pegar últimos 12 meses
  const lastTwelveMonths = sortedMonths.slice(
    Math.max(0, sortedMonths.length - 12)
  )

  const monthLabels = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  let cumulativeBalance = 0

  return lastTwelveMonths.map((yearMonth) => {
    const monthTransactions = aggregated[yearMonth]
    const monthIndex = parseInt(yearMonth.split('-')[1]) - 1

    const monthIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const monthExpense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    cumulativeBalance += monthIncome - monthExpense

    return {
      month: monthLabels[monthIndex],
      balance: cumulativeBalance,
    }
  })
}

/**
 * Fallback para usuários sem dados
 * Retorna 12 meses vazios para evitar gráficos quebrados
 */
export function getEmptyExpensesChartData(): ExpenseChartData[] {
  return [
    { month: 'Jan', income: 0, expense: 0 },
    { month: 'Fev', income: 0, expense: 0 },
    { month: 'Mar', income: 0, expense: 0 },
    { month: 'Abr', income: 0, expense: 0 },
    { month: 'Mai', income: 0, expense: 0 },
    { month: 'Jun', income: 0, expense: 0 },
    { month: 'Jul', income: 0, expense: 0 },
    { month: 'Ago', income: 0, expense: 0 },
    { month: 'Set', income: 0, expense: 0 },
    { month: 'Out', income: 0, expense: 0 },
    { month: 'Nov', income: 0, expense: 0 },
    { month: 'Dez', income: 0, expense: 0 },
  ]
}

/**
 * Fallback para usuários sem dados
 * Retorna 12 meses vazios para evitar gráficos quebrados
 */
export function getEmptyBalanceChartData(): BalanceChartData[] {
  return [
    { month: 'Jan', balance: 0 },
    { month: 'Fev', balance: 0 },
    { month: 'Mar', balance: 0 },
    { month: 'Abr', balance: 0 },
    { month: 'Mai', balance: 0 },
    { month: 'Jun', balance: 0 },
    { month: 'Jul', balance: 0 },
    { month: 'Ago', balance: 0 },
    { month: 'Set', balance: 0 },
    { month: 'Out', balance: 0 },
    { month: 'Nov', balance: 0 },
    { month: 'Dez', balance: 0 },
  ]
}
