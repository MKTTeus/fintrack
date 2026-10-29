import { supabase } from '@/lib/supabase'

import { formatCurrency } from '@/utils/transaction-formatters'
import { getTotalAvailableBalance } from '@/features/wallets/utils/wallet-ledger'

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

async function getCashLedger() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const [walletsResult, transactionsResult, transfersResult, paymentsResult] = await Promise.all([
    supabase.from('wallets').select('*').eq('user_id', user.id).eq('is_active', true),
    supabase.from('transactions').select('*').eq('user_id', user.id),
    supabase.from('wallet_transfers').select('*').eq('user_id', user.id),
    supabase.from('credit_card_payments').select('*').eq('user_id', user.id),
  ])
  if (walletsResult.error) throw walletsResult.error
  if (transactionsResult.error) throw transactionsResult.error
  if (transfersResult.error) throw transfersResult.error
  if (paymentsResult.error) throw paymentsResult.error
  return {
    wallets: walletsResult.data ?? [],
    transactions: transactionsResult.data ?? [],
    transfers: transfersResult.data ?? [],
    payments: paymentsResult.data ?? [],
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { wallets, transactions, transfers, payments } = await getCashLedger()
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (acc, transaction) =>
        acc + Number(transaction.amount),
      0
    )

  const expenses = transactions
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
    balance: getTotalAvailableBalance(wallets, transactions, transfers, payments),
    income,
    expenses,
    transactionsCount: transactions.length,
  }
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  const summary = await getDashboardSummary()

  return [
    {
      title: 'Saldo Total',
      value: formatCurrency(summary.balance),
      change: 'Saldo estimado das carteiras',
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
    const { wallets, transactions, transfers, payments } = await getCashLedger()
    const cashWalletIds = new Set(
      wallets.filter(wallet => wallet.type !== 'credit_card').map(wallet => wallet.id),
    )
    const initialBalance = wallets
      .filter(wallet => wallet.type !== 'credit_card')
      .reduce((sum, wallet) => sum + Number(wallet.current_balance), 0)
    const flows: Transaction[] = transactions
      .filter(transaction => transaction.wallet_id !== null
        && cashWalletIds.has(transaction.wallet_id))
      .map(transaction => ({
        amount: Number(transaction.amount),
        type: transaction.type,
        transaction_date: transaction.transaction_date,
      }))
    // Transfers only change the total when money moves to/from an archived wallet.
    for (const transfer of transfers) {
      if (cashWalletIds.has(transfer.source_wallet_id)) {
        flows.push({ type: 'expense', amount: Number(transfer.amount), transaction_date: transfer.transfer_date })
      }
      if (cashWalletIds.has(transfer.destination_wallet_id)) {
        flows.push({ type: 'income', amount: Number(transfer.amount), transaction_date: transfer.transfer_date })
      }
    }
    for (const payment of payments) {
      if (cashWalletIds.has(payment.source_wallet_id)) {
        flows.push({ type: 'expense', amount: Number(payment.amount), transaction_date: payment.payment_date })
      }
    }
    if (flows.length === 0) return initialBalance !== 0
      ? [{ month: 'Saldo inicial', balance: initialBalance }]
      : getEmptyBalanceChartData()
    return calculateCumulativeBalance(flows, initialBalance)
  } catch (error) {
    console.error(
      'Erro ao buscar dados de saldo:',
      error
    )
    return getEmptyBalanceChartData()
  }
}