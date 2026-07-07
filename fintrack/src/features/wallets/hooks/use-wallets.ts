import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'
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

export function useWallets() {
  const { loading, user } = useAuth()
  const transactionsQuery = useTransactions()
  const creditCardsQuery = useCreditCards()

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
        ),
      ),
    [
      creditCardsQuery.data,
      transactionsQuery.data,
      walletsQuery.data,
    ],
  )

  const walletGroups = useMemo(
    () =>
      getGroupedWalletItems(
        walletsQuery.data ?? [],
        transactionsQuery.data ?? [],
        creditCardsQuery.data ?? [],
      ),
    [
      creditCardsQuery.data,
      transactionsQuery.data,
      walletsQuery.data,
    ],
  )

  const summaries = useMemo(
    () =>
      getWalletSummaries(
        walletsQuery.data ?? [],
        transactionsQuery.data ?? [],
      ),
    [transactionsQuery.data, walletsQuery.data],
  )

  return {
    isError:
      walletsQuery.isError ||
      transactionsQuery.isError ||
      creditCardsQuery.isError,
    isLoading:
      walletsQuery.isLoading ||
      transactionsQuery.isLoading ||
      creditCardsQuery.isLoading,
    creditCardsQuery,
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
