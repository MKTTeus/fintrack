import { supabase } from '@/lib/supabase'

import { formatCurrency } from '@/utils/transaction-formatters'

import {
  calculateCumulativeBalance,
  calculateMonthlyExpenses,
  getEmptyBalanceChartData,
  getEmptyExpensesChartData,
} from './dashboard-aggregation'

import type {
  BalanceChartData,
  DashboardSummary,
  ExpenseChartData,
  Metric,
} from '@/types/dashboard'

import type { Transaction } from './dashboard-aggregation'

/**
 * Busca todas as transações do usuário autenticado
 * Sem limite, para cálculos de gráficos históricos
 */
async function getAllUserTransactions(): Promise<
  Transaction[]
> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, transaction_date')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  const income = data
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (acc, transaction) =>
        acc + Number(transaction.amount),
      0
    )

  const expenses = data
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (acc, transaction) =>
        acc + Number(transaction.amount),
      0
    )

  return {
    balance: income - expenses,
    income,
    expenses,
    transactionsCount: data.length,
  }
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  const summary = await getDashboardSummary()

  return [
    {
      title: 'Saldo Total',
      value: formatCurrency(summary.balance),
      change: 'Saldo atual',
      variant: 'default',
    },
    {
      title: 'Receitas',
      value: formatCurrency(summary.income),
      change: `${summary.transactionsCount} transação${summary.transactionsCount !== 1 ? 's' : ''}`,
      variant: 'income',
    },
    {
      title: 'Despesas',
      value: formatCurrency(summary.expenses),
      change: `de ${summary.transactionsCount} movimentações`,
      variant: 'expense',
    },
  ]
}

export async function getExpensesChartData(): Promise<
  ExpenseChartData[]
> {
  try {
    const transactions = await getAllUserTransactions()

    if (transactions.length === 0) {
      return getEmptyExpensesChartData()
    }

    return calculateMonthlyExpenses(transactions)
  } catch (error) {
    console.error(
      'Erro ao buscar dados de receitas/despesas:',
      error
    )
    return getEmptyExpensesChartData()
  }
}

export async function getBalanceChartData(): Promise<
  BalanceChartData[]
> {
  try {
    const transactions = await getAllUserTransactions()

    if (transactions.length === 0) {
      return getEmptyBalanceChartData()
    }

    return calculateCumulativeBalance(transactions)
  } catch (error) {
    console.error(
      'Erro ao buscar dados de saldo:',
      error
    )
    return getEmptyBalanceChartData()
  }
}