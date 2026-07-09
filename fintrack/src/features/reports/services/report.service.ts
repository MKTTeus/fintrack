import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  WalletCards,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

import {
  periodOptions,
  typeOptions,
} from '../constants/report-options'
import type {
  FinancialEvolutionPoint,
  PeriodSummary,
  PeriodSummaryInsight,
  PeriodTransaction,
  ReportBarItem,
  ReportFilters,
  ReportSelectOption,
  ReportSummary,
  ReportsData,
} from '../types/report.types'
import {
  formatReportCurrency,
  formatReportDate,
  formatReportPercent,
} from '../utils/report-formatters'

type TransactionRow =
  Database['public']['Tables']['transactions']['Row']
type WalletRow =
  Database['public']['Tables']['wallets']['Row']

interface PeriodRange {
  end: string | null
  label: string
  start: string | null
}

interface ReportSourceData {
  transactions: TransactionRow[]
  wallets: WalletRow[]
}

const fallbackFilters: ReportFilters = {
  period: 'this-month',
  type: 'all',
  walletId: 'all',
  category: 'all',
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function subtractMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() - months, 1)
}

function formatPeriodLabel(start: string, end: string) {
  return `${formatReportDate(start)} - ${formatReportDate(end)}`
}

function getPeriodRange(filters: ReportFilters): PeriodRange {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const { period } = filters

  if (period === 'last-month') {
    const lastMonth = subtractMonths(now, 1)

    return {
      start: toDateKey(lastMonth),
      end: toDateKey(endOfMonth(lastMonth)),
      label: 'Mês passado',
    }
  }

  if (period === 'last-3-months') {
    return {
      start: toDateKey(subtractMonths(now, 2)),
      end: toDateKey(endOfMonth(now)),
      label: 'Últimos 3 meses',
    }
  }

  if (period === 'last-6-months') {
    return {
      start: toDateKey(subtractMonths(now, 5)),
      end: toDateKey(endOfMonth(now)),
      label: 'Últimos 6 meses',
    }
  }

  if (period === 'this-year') {
    return {
      start: toDateKey(new Date(now.getFullYear(), 0, 1)),
      end: toDateKey(now),
      label: 'Este ano',
    }
  }

  if (period === 'custom') {
    if (filters.customStartDate && filters.customEndDate) {
      return {
        start: filters.customStartDate,
        end: filters.customEndDate,
        label: formatPeriodLabel(
          filters.customStartDate,
          filters.customEndDate,
        ),
      }
    }

    return {
      start: null,
      end: null,
      label: 'Personalizado',
    }
  }

  return {
    start: toDateKey(currentMonthStart),
    end: toDateKey(endOfMonth(now)),
    label: 'Este mês',
  }
}

function getPreviousPeriodRange(range: PeriodRange): PeriodRange {
  if (!range.start || !range.end) {
    return { start: null, end: null, label: 'Período anterior' }
  }

  const start = new Date(`${range.start}T00:00:00`)
  const end = new Date(`${range.end}T00:00:00`)
  const duration =
    Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1
  const previousEnd = new Date(start)
  previousEnd.setDate(previousEnd.getDate() - 1)
  const previousStart = new Date(previousEnd)
  previousStart.setDate(previousStart.getDate() - duration + 1)

  return {
    start: toDateKey(previousStart),
    end: toDateKey(previousEnd),
    label: 'Período anterior',
  }
}

function isWithinRange(
  transaction: TransactionRow,
  range: PeriodRange,
) {
  if (range.start && transaction.transaction_date < range.start) {
    return false
  }

  if (range.end && transaction.transaction_date > range.end) {
    return false
  }

  return true
}

function applyFilters(
  transactions: TransactionRow[],
  filters: ReportFilters,
  range: PeriodRange,
) {
  return transactions.filter((transaction) => {
    if (!isWithinRange(transaction, range)) {
      return false
    }

    if (
      filters.type !== 'all' &&
      transaction.type !== filters.type
    ) {
      return false
    }

    if (
      filters.walletId !== 'all' &&
      transaction.wallet_id !== filters.walletId
    ) {
      return false
    }

    if (
      filters.category !== 'all' &&
      transaction.category !== filters.category
    ) {
      return false
    }

    return true
  })
}

function sumByType(
  transactions: TransactionRow[],
  type: TransactionRow['type'],
) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)
}

function getComparisonLabel(current: number, previous: number) {
  if (previous <= 0 && current <= 0) {
    return '0% vs. período anterior'
  }

  if (previous <= 0) {
    return '+100% vs. período anterior'
  }

  const variation = ((current - previous) / previous) * 100
  const sign = variation >= 0 ? '+' : ''

  return `${sign}${Math.round(variation)}% vs. período anterior`
}

function getWalletName(
  walletId: string | null,
  walletsById: Map<string, WalletRow>,
) {
  if (!walletId) {
    return 'Sem carteira'
  }

  return walletsById.get(walletId)?.name ?? 'Carteira removida'
}

function getReportSummaries(
  transactions: TransactionRow[],
  previousTransactions: TransactionRow[],
): ReportSummary[] {
  const income = sumByType(transactions, 'income')
  const expense = sumByType(transactions, 'expense')
  const previousIncome = sumByType(previousTransactions, 'income')
  const previousExpense = sumByType(previousTransactions, 'expense')
  const balance = income - expense
  const previousBalance = previousIncome - previousExpense
  const savingRate = income > 0 ? (balance / income) * 100 : 0
  const previousSavingRate =
    previousIncome > 0
      ? ((previousIncome - previousExpense) / previousIncome) * 100
      : 0

  return [
    {
      title: 'Receitas',
      value: formatReportCurrency(income),
      comparison: getComparisonLabel(income, previousIncome),
      icon: ArrowUpRight,
      tone: 'income',
    },
    {
      title: 'Despesas',
      value: formatReportCurrency(expense),
      comparison: getComparisonLabel(expense, previousExpense),
      icon: ArrowDownRight,
      tone: 'expense',
    },
    {
      title: 'Saldo',
      value: formatReportCurrency(balance),
      comparison: getComparisonLabel(balance, previousBalance),
      icon: WalletCards,
      tone: 'balance',
    },
    {
      title: 'Economia',
      value: formatReportPercent(savingRate),
      comparison: `${Math.round(
        savingRate - previousSavingRate,
      )} p.p. vs. período anterior`,
      icon: PiggyBank,
      tone: 'saving',
    },
  ]
}

function getMonthLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`)

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
  })
    .format(date)
    .replace('.', '')
    .replace(/^./, (value) => value.toUpperCase())
}

function getEvolutionData(
  transactions: TransactionRow[],
): FinancialEvolutionPoint[] {
  const groups = new Map<string, FinancialEvolutionPoint>()

  transactions.forEach((transaction) => {
    const monthKey = transaction.transaction_date.slice(0, 7)
    const current = groups.get(monthKey) ?? {
      month: getMonthLabel(`${monthKey}-01`),
      income: 0,
      expense: 0,
    }

    if (transaction.type === 'income') {
      current.income += transaction.amount
    } else {
      current.expense += transaction.amount
    }

    groups.set(monthKey, current)
  })

  return Array.from(groups.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, value]) => value)
}

function getCategoryExpenses(
  transactions: TransactionRow[],
): ReportBarItem[] {
  const expenses = transactions.filter(
    (transaction) => transaction.type === 'expense',
  )
  const total = expenses.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )
  const groups = new Map<string, number>()

  expenses.forEach((transaction) => {
    groups.set(
      transaction.category,
      (groups.get(transaction.category) ?? 0) +
        transaction.amount,
    )
  })

  return Array.from(groups.entries())
    .map(([label, amount]) => ({
      label,
      value: formatReportCurrency(amount),
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((first, second) => second.percentage - first.percentage)
}

function getWalletUsage(
  transactions: TransactionRow[],
  walletsById: Map<string, WalletRow>,
): ReportBarItem[] {
  const total = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )
  const groups = new Map<string, number>()

  transactions.forEach((transaction) => {
    const label = getWalletName(transaction.wallet_id, walletsById)
    groups.set(label, (groups.get(label) ?? 0) + transaction.amount)
  })

  return Array.from(groups.entries())
    .map(([label, amount]) => ({
      label,
      value: formatReportCurrency(amount),
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((first, second) => second.percentage - first.percentage)
}

function getPeriodTransactions(
  transactions: TransactionRow[],
  walletsById: Map<string, WalletRow>,
): PeriodTransaction[] {
  return transactions
    .slice()
    .sort((first, second) =>
      second.transaction_date.localeCompare(first.transaction_date),
    )
    .map((transaction) => ({
      id: transaction.id,
      description: transaction.title,
      category: transaction.category,
      wallet: getWalletName(transaction.wallet_id, walletsById),
      date: formatReportDate(transaction.transaction_date),
      value: `${
        transaction.type === 'income' ? '+' : '-'
      } ${formatReportCurrency(transaction.amount)}`,
      type: transaction.type,
    }))
}

function getTopItem(items: ReportBarItem[]) {
  return items.length > 0 ? items[0].label : null
}

function getPeriodSummary(
  transactions: TransactionRow[],
  categoryExpenses: ReportBarItem[],
  walletUsage: ReportBarItem[],
) {
  const income = sumByType(transactions, 'income')
  const expense = sumByType(transactions, 'expense')
  const balance = income - expense
  const savingRate = income > 0 ? (balance / income) * 100 : 0
  const topCategory = getTopItem(categoryExpenses)
  const topWallet = getTopItem(walletUsage)

  const insights: PeriodSummaryInsight[] = [
    {
      tone: balance >= 0 ? 'income' : 'warning',
      text:
        balance >= 0
          ? 'Saldo positivo no período selecionado.'
          : 'Saldo negativo no período selecionado.',
    },
    {
      tone: 'warning',
      text: topCategory
        ? `${topCategory} representa a maior parte dos gastos.`
        : 'Sem despesas suficientes para destacar uma categoria.',
    },
    {
      tone: 'primary',
      text: topWallet
        ? `${topWallet} concentra a maior movimentação.`
        : 'Sem movimentações suficientes por carteira.',
    },
  ]

  if (transactions.length === 0) {
    return {
      insights,
      body:
        'Não há transações para os filtros selecionados. Ajuste o período ou os filtros para visualizar a análise financeira.',
    } satisfies PeriodSummary
  }

  return {
    insights,
    body: `No período selecionado, você teve ${transactions.length} transações e saldo ${balance >= 0 ? 'positivo' : 'negativo'} de ${formatReportCurrency(Math.abs(balance))}, com taxa de economia de ${formatReportPercent(savingRate)}.`,
  } satisfies PeriodSummary
}

function getFilterOptions(
  transactions: TransactionRow[],
  wallets: WalletRow[],
) {
  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category)),
  )
    .sort((first, second) => first.localeCompare(second))
    .map((category) => ({
      label: category,
      value: category,
    }))

  const walletOptions = wallets
    .slice()
    .sort((first, second) => first.name.localeCompare(second.name))
    .map((wallet) => ({
      label: wallet.name,
      value: wallet.id,
    }))

  return {
    categories: [
      { label: 'Todas', value: 'all' },
      ...categories,
    ],
    wallets: [{ label: 'Todas', value: 'all' }, ...walletOptions],
  } satisfies {
    categories: ReportSelectOption[]
    wallets: ReportSelectOption[]
  }
}

async function getReportSourceData(): Promise<ReportSourceData> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const [transactionsResult, walletsResult] = await Promise.all([
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false }),
    supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  if (transactionsResult.error) {
    throw transactionsResult.error
  }

  if (walletsResult.error) {
    throw walletsResult.error
  }

  return {
    transactions: transactionsResult.data ?? [],
    wallets: walletsResult.data ?? [],
  }
}

export async function getReportsData(
  inputFilters: ReportFilters,
): Promise<ReportsData> {
  const filters = {
    ...fallbackFilters,
    ...inputFilters,
  }
  const { transactions, wallets } = await getReportSourceData()
  const walletsById = new Map(
    wallets.map((wallet) => [wallet.id, wallet]),
  )
  const range = getPeriodRange(filters)
  const previousRange = getPreviousPeriodRange(range)
  const filteredTransactions = applyFilters(
    transactions,
    filters,
    range,
  )
  const previousTransactions = applyFilters(
    transactions,
    filters,
    previousRange,
  )
  const categoryExpenses = getCategoryExpenses(filteredTransactions)
  const walletUsage = getWalletUsage(
    filteredTransactions,
    walletsById,
  )

  return {
    categoryExpenses,
    evolution: getEvolutionData(filteredTransactions),
    filterOptions: getFilterOptions(transactions, wallets),
    hasTransactions: filteredTransactions.length > 0,
    periodLabel: range.label,
    periodSummary: getPeriodSummary(
      filteredTransactions,
      categoryExpenses,
      walletUsage,
    ),
    summaries: getReportSummaries(
      filteredTransactions,
      previousTransactions,
    ),
    transactions: getPeriodTransactions(
      filteredTransactions,
      walletsById,
    ),
    walletUsage,
  }
}

export function getDefaultReportFilters(): ReportFilters {
  return fallbackFilters
}

export function getBaseReportFilterOptions() {
  return {
    periods: periodOptions,
    types: typeOptions,
  }
}
