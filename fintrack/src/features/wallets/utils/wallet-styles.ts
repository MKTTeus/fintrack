import type {
  DetailTone,
  DynamicTone,
  SummaryVariant,
} from '../types/wallet.types'

export const summaryVariantStyles: Record<
  SummaryVariant,
  { icon: string; value: string }
> = {
  default: {
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
  income: {
    icon: 'bg-income/10 text-income',
    value: 'text-income',
  },
  expense: {
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-destructive',
  },
}

export const dynamicToneStyles: Record<DynamicTone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  income: 'text-income',
}

export const detailToneStyles: Record<DetailTone, string> = {
  default: 'text-foreground',
  income: 'text-income',
  expense: 'text-destructive',
  primary: 'text-primary',
}
