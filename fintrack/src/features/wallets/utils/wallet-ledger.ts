import type { Database } from '@/types/database.types'

type Wallet = Database['public']['Tables']['wallets']['Row']
type CreditCard = Database['public']['Tables']['credit_cards']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']
type CashTransaction = Pick<Transaction, 'wallet_id' | 'type' | 'amount'>
type Transfer = Database['public']['Tables']['wallet_transfers']['Row']
type CardPayment = Database['public']['Tables']['credit_card_payments']['Row']

/**
 * Financial basis: wallets.current_balance represents the INITIAL balance.
 * Credit card purchases create a liability, not a second cash expense.
 * Transfers move cash, and card settlements decrease cash and card liability.
 */
export function getAvailableWalletBalance(
  wallet: Wallet,
  transactions: CashTransaction[],
  transfers: Transfer[] = [],
  cardPayments: CardPayment[] = [],
): number {
  if (wallet.type === 'credit_card') return 0
  const booked = transactions.reduce((sum, tx) =>
    tx.wallet_id !== wallet.id ? sum :
      sum + (tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)), 0)
  const internal = transfers.reduce((sum, transfer) =>
    sum + (transfer.destination_wallet_id === wallet.id ? Number(transfer.amount) : 0)
      - (transfer.source_wallet_id === wallet.id ? Number(transfer.amount) : 0), 0)
  const settlements = cardPayments.reduce((sum, payment) =>
    sum + (payment.source_wallet_id === wallet.id ? Number(payment.amount) : 0), 0)
  return Number(wallet.current_balance) + booked + internal - settlements
}

export function getTotalAvailableBalance(
  wallets: Wallet[],
  transactions: CashTransaction[],
  transfers: Transfer[] = [],
  payments: CardPayment[] = [],
): number {
  return wallets.filter(wallet => wallet.is_active && wallet.type !== 'credit_card')
    .reduce((sum, wallet) => sum + getAvailableWalletBalance(wallet, transactions, transfers, payments), 0)
}

export function getCardOutstanding(
  card: CreditCard,
  transactions: CashTransaction[],
  payments: CardPayment[] = [],
): number {
  const charges = transactions.reduce((sum, tx) =>
    tx.wallet_id !== card.wallet_id ? sum
      : sum + (tx.type === 'expense' ? Number(tx.amount) : -Number(tx.amount)), 0)
  const settlements = payments.reduce((sum, payment) =>
    sum + (payment.credit_card_id === card.id ? Number(payment.amount) : 0), 0)
  return Math.max(0, charges - settlements)
}

function monthDay(year: number, month: number, day: number): Date {
  const last = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(Math.max(day, 1), last))
}
function dateKey(date: Date): string {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'),
    String(date.getDate()).padStart(2,'0')].join('-')
}

/**
 * Card purchases after closing belong to the NEXT cycle.
 * Returns open-cycle dates, not an amount due or a bank-certified invoice.
 */
export function getOpenCardCycle(closingDay: number | null, today = new Date()) {
  if (!closingDay || closingDay < 1 || closingDay > 31) return null
  const year = today.getFullYear(), month = today.getMonth()
  const thisClosing = monthDay(year, month, closingDay)
  const closing = today.getDate() <= thisClosing.getDate()
    ? thisClosing : monthDay(year, month + 1, closingDay)
  const previousClosing = today.getDate() <= thisClosing.getDate()
    ? monthDay(year, month - 1, closingDay) : thisClosing
  const start = new Date(previousClosing.getFullYear(), previousClosing.getMonth(), previousClosing.getDate() + 1)
  return { start: dateKey(start), end: dateKey(closing), closingDate: dateKey(closing) }
}

export function getOpenCycleCharges(
  card: CreditCard, transactions: Transaction[], today = new Date(),
): number | null {
  const cycle = getOpenCardCycle(card.closing_day, today)
  if (!cycle) return null
  return transactions
    .filter(tx => tx.wallet_id === card.wallet_id
      && tx.transaction_date >= cycle.start && tx.transaction_date <= cycle.end)
    .reduce((sum, tx) =>
      sum + (tx.type === 'expense' ? Number(tx.amount) : -Number(tx.amount)), 0)
}
