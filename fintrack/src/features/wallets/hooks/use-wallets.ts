import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'
import { listInvestmentMovements } from '@/features/investments/investment.service'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'

import { paymentTypeOptions } from '../constants/wallet-options'
import { listWallets } from '../services/wallet.service'
import {
  getGroupedWalletItems,
  getWalletSummaries,
  walletToWalletItem,
} from '../utils/wallet-formatters'

import { useCreateWallet } from './use-create-wallet'
import { useCreditCards } from './use-credit-cards'
import { useDeleteWallet } from './use-delete-wallet'
import { useUpdateWallet } from './use-update-wallet'
import { useCreateCreditCard } from './use-create-credit-card'
import { useUpdateCreditCard } from './use-update-credit-card'
import { useWalletTransfers } from './use-wallet-transfers'
import { useCreditCardPayments } from './use-credit-card-payments'

export function useWallets() {
  const { loading, user } = useAuth()
  const transactionsQuery = useTransactions()
  const investmentsQuery = useQuery({
    queryKey: queryKeys.investments.movements,
    queryFn: listInvestmentMovements,
    enabled: !loading && !!user,
  })
  const creditCardsQuery = useCreditCards()
  const transfersLedger = useWalletTransfers()
  const cardPaymentsLedger = useCreditCardPayments()

  const walletsQuery = useQuery({
    queryKey: queryKeys.wallets.list,
    queryFn: listWallets,
    enabled: !loading && !!user,
  })

  const wallets = useMemo(
    () =>
      (walletsQuery.data ?? []).map((wallet) =>
        walletToWalletItem(
          wallet,
          transactionsQuery.data ?? [],
          creditCardsQuery.data ?? [],
          transfersLedger.transfers,
          cardPaymentsLedger.payments,
          investmentsQuery.data ?? [],
        ),
      ),
    [
      creditCardsQuery.data,
      transactionsQuery.data,
      walletsQuery.data,
      transfersLedger.transfers,
      cardPaymentsLedger.payments,
      investmentsQuery.data,
    ],
  )

  const walletGroups = useMemo(
    () =>
      getGroupedWalletItems(
        walletsQuery.data ?? [],
        transactionsQuery.data ?? [],
        creditCardsQuery.data ?? [],
        transfersLedger.transfers,
        cardPaymentsLedger.payments,
        investmentsQuery.data ?? [],
      ),
    [
      creditCardsQuery.data,
      transactionsQuery.data,
      walletsQuery.data,
      transfersLedger.transfers,
      cardPaymentsLedger.payments,
    ],
  )

  const summaries = useMemo(
    () =>
      getWalletSummaries(
        walletsQuery.data ?? [],
        transactionsQuery.data ?? [],
        transfersLedger.transfers,
        cardPaymentsLedger.payments,
        creditCardsQuery.data ?? [],
        investmentsQuery.data ?? [],
      ),
    [transactionsQuery.data, walletsQuery.data, transfersLedger.transfers, cardPaymentsLedger.payments, creditCardsQuery.data, investmentsQuery.data],
  )

  return {
    isError:
      walletsQuery.isError ||
      transactionsQuery.isError ||
      creditCardsQuery.isError || investmentsQuery.isError || transfersLedger.query.isError || cardPaymentsLedger.query.isError,
    isLoading:
      walletsQuery.isLoading ||
      transactionsQuery.isLoading ||
      creditCardsQuery.isLoading || investmentsQuery.isLoading || transfersLedger.query.isLoading || cardPaymentsLedger.query.isLoading,
    creditCardsQuery,
    transfersLedger,
    cardPaymentsLedger,
    paymentTypes: paymentTypeOptions,
    summaries,
    transactionsQuery,
    walletGroups,
    wallets,
    walletsQuery,
    createCreditCard: useCreateCreditCard(),
    createWallet: useCreateWallet(),
    updateCreditCard: useUpdateCreditCard(),
    updateWallet: useUpdateWallet(),
    deleteWallet: useDeleteWallet(),
  }
}
