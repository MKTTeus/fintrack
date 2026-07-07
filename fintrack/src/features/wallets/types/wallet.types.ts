import type { LucideIcon } from 'lucide-react'

import type { Database } from '@/types/database.types'

export type Wallet =
  Database['public']['Tables']['wallets']['Row']

export type CreditCard =
  Database['public']['Tables']['credit_cards']['Row']

export type WalletType = Wallet['type']

export type CreateWalletInput = Pick<
  Database['public']['Tables']['wallets']['Insert'],
  | 'name'
  | 'type'
  | 'description'
  | 'current_balance'
  | 'color'
  | 'icon'
>

export type UpdateWalletInput = Partial<CreateWalletInput> & {
  is_active?: boolean
}

export type DeleteWalletInput = {
  id: string
}

export type CreateCreditCardInput = Pick<
  Database['public']['Tables']['credit_cards']['Insert'],
  | 'wallet_id'
  | 'bank_name'
  | 'card_name'
  | 'last_four_digits'
  | 'credit_limit'
  | 'closing_day'
  | 'due_day'
>

export type UpdateCreditCardInput =
  Partial<CreateCreditCardInput> & {
    is_active?: boolean
  }

export type SummaryVariant = 'default' | 'income' | 'expense'
export type DynamicTone = 'default' | 'primary' | 'income'
export type DetailTone = 'default' | 'income' | 'expense' | 'primary'

export interface WalletSummary {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  variant: SummaryVariant
}

export interface CreditCardItem {
  bank: string
  finalDigits: string
  invoice: string
  availableLimit: string
  dueDate: string
  tag?: string
}

export interface WalletItem {
  id: string
  type: WalletType
  name: string
  description: string
  currentValue: string
  currentHint: string
  transactions: number
  spentThisMonth: string
  spentHint: string
  dynamicLabel: string
  dynamicValue: string
  dynamicHint?: string
  dynamicTone: DynamicTone
  icon: LucideIcon
  iconClassName: string
  iconName?: string
  color?: string
  linkedWallets?: WalletItem[]
  creditCard?: CreditCard
  details: {
    pix?: {
      key: string
      bank: string
      holder: string
      keyType: string
    }
    credit?: {
      invoice: string
      availableLimit: string
      totalLimit: string
      cards: CreditCardItem[]
    }
    debit?: {
      bank: string
      agency: string
      account: string
      balance: string
    }
    cash?: {
      walletName: string
      value: string
      notes: string
    }
  }
}

export interface PaymentTypeOption {
  type: WalletType
  label: string
  description: string
  icon: LucideIcon
}
