import {
  Banknote,
  CreditCard,
  QrCode,
  WalletCards,
} from 'lucide-react'

import type { PaymentTypeOption } from '../types/wallet.types'

export const paymentTypeOptions: PaymentTypeOption[] = [
  {
    type: 'pix',
    label: 'Pix',
    description: 'Chaves e recebimentos instantâneos',
    icon: QrCode,
  },
  {
    type: 'credit_card',
    label: 'Cartão de Crédito',
    description: 'Fatura, limite e vencimento',
    icon: CreditCard,
  },
  {
    type: 'debit_card',
    label: 'Cartão de Débito',
    description: 'Conta e saldo disponível',
    icon: WalletCards,
  },
  {
    type: 'cash',
    label: 'Dinheiro',
    description: 'Caixa físico e observações',
    icon: Banknote,
  },
]
