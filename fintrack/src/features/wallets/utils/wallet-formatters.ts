import {
  ArrowLeftRight,
  Banknote,
  CreditCard,
  QrCode,
  Wallet,
  WalletCards,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { Transaction } from '@/features/transactions/types/transaction.types'
import { formatCurrency } from '@/utils/transaction-formatters'

import type {
  CreditCard as CreditCardRecord,
  DynamicTone,
  Wallet as WalletRecord,
  WalletItem,
  WalletSummary,
  WalletType,
} from '../types/wallet.types'
import {
  getWalletDescriptionText,
  parseWalletMetadata,
} from './wallet-metadata'

const walletTypeOrder = [
  'pix',
  'debit_card',
  'credit_card',
  'cash',
] as const satisfies WalletType[]

const walletTypeConfig = {
  pix: {
    name: 'Pix',
    description: 'Transferências instantâneas',
    currentHint: 'Disponível',
    spentHint: 'Saídas',
    icon: QrCode,
    iconClassName: 'bg-primary/10 text-primary',
  },
  debit_card: {
    name: 'Cartão de Débito',
    description: 'Pagamentos à vista',
    currentHint: 'Disponível',
    spentHint: 'Saídas',
    icon: WalletCards,
    iconClassName: 'bg-income/10 text-income',
  },
  credit_card: {
    name: 'Cartão de Crédito',
    description: 'Compras parceladas',
    currentHint: 'Fatura atual',
    spentHint: 'Total da fatura',
    icon: CreditCard,
    iconClassName: 'bg-destructive/10 text-destructive',
  },
  cash: {
    name: 'Dinheiro',
    description: 'Notas e moedas',
    currentHint: 'Em caixa',
    spentHint: 'Saídas',
    icon: Banknote,
    iconClassName: 'bg-amber-500/10 text-amber-500',
  },
} satisfies Record<
  WalletType,
  {
    name: string
    description: string
    currentHint: string
    spentHint: string
    icon: LucideIcon
    iconClassName: string
  }
>

const iconRegistry: Record<string, LucideIcon> = {
  qrcode: QrCode,
  qr_code: QrCode,
  pix: QrCode,
  creditcard: CreditCard,
  credit_card: CreditCard,
  debitcard: WalletCards,
  debit_card: WalletCards,
  walletcards: WalletCards,
  banknote: Banknote,
  cash: Banknote,
  wallet: Wallet,
}

interface WalletStats {
  received: number
  spent: number
  transactions: number
}

function getMonthBounds(referenceDate = new Date()) {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 1)

  return {
    end: end.toISOString().slice(0, 10),
    start: start.toISOString().slice(0, 10),
  }
}

function getLast30DaysStart(referenceDate = new Date()) {
  const start = new Date(referenceDate)
  start.setDate(start.getDate() - 30)

  return start.toISOString().slice(0, 10)
}

function isCurrentMonthTransaction(transaction: Transaction) {
  const { end, start } = getMonthBounds()

  return (
    transaction.transaction_date >= start &&
    transaction.transaction_date < end
  )
}

function getMonthlyStats(transactions: Transaction[]): WalletStats {
  return transactions
    .filter(isCurrentMonthTransaction)
    .reduce<WalletStats>(
      (stats, transaction) => {
        const amount = Number(transaction.amount)

        if (transaction.type === 'income') {
          return {
            ...stats,
            received: stats.received + amount,
            transactions: stats.transactions + 1,
          }
        }

        return {
          ...stats,
          spent: stats.spent + amount,
          transactions: stats.transactions + 1,
        }
      },
      {
        received: 0,
        spent: 0,
        transactions: 0,
      },
    )
}

function getTransactionBalance(transactions: Transaction[]) {
  return transactions.reduce((total, transaction) => {
    const amount = Number(transaction.amount)

    return transaction.type === 'income'
      ? total + amount
      : total - amount
  }, 0)
}

function getWalletIcon(wallet: WalletRecord) {
  const iconKey = wallet.icon
    ?.replace(/[\s-]/g, '_')
    .toLowerCase()

  if (iconKey && iconRegistry[iconKey]) {
    return iconRegistry[iconKey]
  }

  return walletTypeConfig[wallet.type].icon
}

function getTransactionsByWallet(
  transactions: Transaction[],
  walletId: string,
) {
  return transactions.filter(
    (transaction) => transaction.wallet_id === walletId,
  )
}

function getTransactionsByWalletIds(
  transactions: Transaction[],
  walletIds: Set<string>,
) {
  return transactions.filter(
    (transaction) =>
      transaction.wallet_id !== null &&
      walletIds.has(transaction.wallet_id),
  )
}

function getWalletTransactionCount(
  transactions: Transaction[],
  walletId: string,
) {
  return transactions.filter(
    (transaction) => transaction.wallet_id === walletId,
  ).length
}

function getCreditCardByWallet(
  creditCards: CreditCardRecord[],
  walletId: string,
) {
  return creditCards.find(
    (creditCard) => creditCard.wallet_id === walletId,
  )
}

function getMostRelevantCreditCard(
  wallets: WalletRecord[],
  transactions: Transaction[],
  creditCards: CreditCardRecord[],
) {
  const cardsByWallet = wallets
    .map((wallet) => getCreditCardByWallet(creditCards, wallet.id))
    .filter((creditCard): creditCard is CreditCardRecord =>
      Boolean(creditCard),
    )

  if (!cardsByWallet.length) {
    return null
  }

  const monthlyTransactions = transactions.filter(
    isCurrentMonthTransaction,
  )

  return [...cardsByWallet].sort((first, second) => {
    const secondTransactions = getWalletTransactionCount(
      monthlyTransactions,
      second.wallet_id,
    )
    const firstTransactions = getWalletTransactionCount(
      monthlyTransactions,
      first.wallet_id,
    )

    if (secondTransactions !== firstTransactions) {
      return secondTransactions - firstTransactions
    }

    return first.created_at.localeCompare(second.created_at)
  })[0]
}

function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getNextDueDate(
  dueDay?: number | null,
  referenceDate = new Date(),
) {
  if (!dueDay) {
    return null
  }

  const targetMonth =
    referenceDate.getDate() > dueDay
      ? referenceDate.getMonth() + 1
      : referenceDate.getMonth()
  const targetYear = referenceDate.getFullYear()
  const lastDay = getLastDayOfMonth(targetYear, targetMonth)
  const safeDay = Math.min(dueDay, lastDay)

  return new Date(targetYear, targetMonth, safeDay)
}

function formatDueDate(dueDay?: number | null) {
  const dueDate = getNextDueDate(dueDay)

  if (!dueDate) {
    return 'Não informado'
  }

  return new Intl.DateTimeFormat('pt-BR').format(dueDate)
}

function getDynamicInfo(
  type: WalletType,
  stats: WalletStats,
  relevantCreditCard?: CreditCardRecord | null,
): {
  dynamicHint?: string
  dynamicLabel: string
  dynamicTone: DynamicTone
  dynamicValue: string
} {
  if (type === 'credit_card') {
    return {
      dynamicLabel: 'Próximo vencimento',
      dynamicValue: formatDueDate(relevantCreditCard?.due_day),
      dynamicHint: relevantCreditCard
        ? relevantCreditCard.card_name
        : 'Nenhum cartão ativo',
      dynamicTone: 'primary',
    }
  }

  if (type === 'debit_card') {
    return {
      dynamicLabel: 'Informação',
      dynamicValue: 'Débito à vista',
      dynamicHint: 'Baixa imediata',
      dynamicTone: 'default',
    }
  }

  return {
    dynamicLabel: 'Recebido no mês',
    dynamicValue: formatCurrency(stats.received),
    dynamicHint: 'Entradas',
    dynamicTone: 'income',
  }
}

export function walletToWalletItem(
  wallet: WalletRecord,
  transactions: Transaction[] = [],
  creditCards: CreditCardRecord[] = [],
): WalletItem {
  const config = walletTypeConfig[wallet.type]
  const metadata = parseWalletMetadata(wallet.description)
  const creditCard = getCreditCardByWallet(creditCards, wallet.id)
  const walletTransactions = getTransactionsByWallet(
    transactions,
    wallet.id,
  )
  const stats = getMonthlyStats(walletTransactions)
  const dynamicInfo = getDynamicInfo(
    wallet.type,
    stats,
    creditCard,
  )
  const formattedBalance = formatCurrency(
    getTransactionBalance(walletTransactions),
  )
  const creditLimit = Number(creditCard?.credit_limit ?? 0)
  const availableLimit = Math.max(creditLimit - stats.spent, 0)

  return {
    id: wallet.id,
    type: wallet.type,
    name: wallet.name,
    description:
      getWalletDescriptionText(wallet.description) ??
      config.description,
    currentValue: formattedBalance,
    currentHint: config.currentHint,
    transactions: stats.transactions,
    spentThisMonth: formatCurrency(stats.spent),
    spentHint: config.spentHint,
    ...dynamicInfo,
    icon: getWalletIcon(wallet),
    iconClassName: config.iconClassName,
    iconName: wallet.icon ?? undefined,
    color: wallet.color ?? undefined,
    creditCard,
    details: {
      pix:
        wallet.type === 'pix'
          ? {
              key: metadata.pixKey ?? 'Não informado',
              bank: metadata.bank ?? 'Não informado',
              holder: wallet.name,
              keyType: metadata.pixKeyType ?? 'Não informado',
            }
          : undefined,
      credit:
        wallet.type === 'credit_card'
          ? {
              invoice: formatCurrency(stats.spent),
              availableLimit: creditCard
                ? formatCurrency(availableLimit)
                : 'Não informado',
              totalLimit: creditCard?.credit_limit
                ? formatCurrency(Number(creditCard.credit_limit))
                : 'Não informado',
              cards: creditCard
                ? [
                    {
                      bank:
                        creditCard.bank_name ?? 'Não informado',
                      finalDigits:
                        creditCard.last_four_digits ??
                        'Não informado',
                      invoice: formatCurrency(stats.spent),
                      availableLimit:
                        formatCurrency(availableLimit),
                      dueDate: formatDueDate(creditCard.due_day),
                      tag: creditCard.card_name,
                    },
                  ]
                : [],
            }
          : undefined,
      debit:
        wallet.type === 'debit_card'
          ? {
              bank: metadata.bank ?? 'Não informado',
              agency: metadata.agency ?? 'Não informado',
              account: metadata.account ?? 'Não informado',
              balance: formattedBalance,
            }
          : undefined,
      cash:
        wallet.type === 'cash'
          ? {
              walletName: wallet.name,
              value: formattedBalance,
              notes:
                metadata.observations ??
                metadata.description ??
                'Nenhuma observação cadastrada.',
            }
          : undefined,
    },
  }
}

export function getGroupedWalletItems(
  wallets: WalletRecord[],
  transactions: Transaction[],
  creditCards: CreditCardRecord[] = [],
): WalletItem[] {
  return walletTypeOrder.map((type) => {
    const config = walletTypeConfig[type]
    const walletsByType = wallets.filter(
      (wallet) => wallet.type === type,
    )
    const walletIds = new Set(
      walletsByType.map((wallet) => wallet.id),
    )
    const transactionsByType = getTransactionsByWalletIds(
      transactions,
      walletIds,
    )
    const stats = getMonthlyStats(transactionsByType)
    const relevantCreditCard =
      type === 'credit_card'
        ? getMostRelevantCreditCard(
            walletsByType,
            transactionsByType,
            creditCards,
          )
        : null
    const dynamicInfo = getDynamicInfo(
      type,
      stats,
      relevantCreditCard,
    )

    return {
      id: `group-${type}`,
      type,
      name: config.name,
      description: config.description,
      currentValue: formatCurrency(
        getTransactionBalance(transactionsByType),
      ),
      currentHint: config.currentHint,
      transactions: stats.transactions,
      spentThisMonth: formatCurrency(stats.spent),
      spentHint: config.spentHint,
      ...dynamicInfo,
      icon: config.icon,
      iconClassName: config.iconClassName,
      color:
        walletsByType.find((wallet) => wallet.color)?.color ??
        undefined,
      linkedWallets: walletsByType.map((wallet) =>
        walletToWalletItem(wallet, transactions, creditCards),
      ),
      details: {},
    }
  })
}

export function getWalletSummaries(
  wallets: WalletRecord[],
  transactions: Transaction[] = [],
): WalletSummary[] {
  const last30DaysStart = getLast30DaysStart()
  const walletIds = new Set(wallets.map((wallet) => wallet.id))
  const walletTransactions = transactions.filter(
    (transaction) =>
      transaction.wallet_id !== null &&
      walletIds.has(transaction.wallet_id),
  )
  const recentTransactions = walletTransactions.filter(
    (transaction) =>
      transaction.transaction_date >= last30DaysStart,
  )

  return [
    {
      title: 'Saldo combinado',
      value: formatCurrency(
        getTransactionBalance(walletTransactions),
      ),
      detail: 'Saldo calculado por transações',
      icon: Wallet,
      variant: 'default',
    },
    {
      title: 'Carteiras ativas',
      value: String(wallets.length),
      detail: 'Meios de pagamento configurados',
      icon: CreditCard,
      variant: 'income',
    },
    {
      title: 'Transações (30 dias)',
      value: String(recentTransactions.length),
      detail: 'Movimentações realizadas',
      icon: ArrowLeftRight,
      variant: 'expense',
    },
  ]
}
