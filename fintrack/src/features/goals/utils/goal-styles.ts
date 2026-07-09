import type {
  GoalSummaryVariant,
  GoalTone,
} from '../types/goal.types'

export const goalToneStyles: Record<
  GoalTone,
  {
    icon: string
    progress: string
    soft: string
    text: string
  }
> = {
  pink: {
    icon: 'bg-destructive/15 text-destructive',
    progress: 'bg-destructive',
    soft: 'bg-destructive/10',
    text: 'text-destructive',
  },
  blue: {
    icon: 'bg-primary/15 text-primary',
    progress: 'bg-primary',
    soft: 'bg-primary/10',
    text: 'text-primary',
  },
  green: {
    icon: 'bg-income/15 text-income',
    progress: 'bg-income',
    soft: 'bg-income/10',
    text: 'text-income',
  },
  purple: {
    icon: 'bg-violet-500/15 text-violet-400',
    progress: 'bg-violet-500',
    soft: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    progress: 'bg-amber-500',
    soft: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
}

export const goalSummaryVariantStyles: Record<
  GoalSummaryVariant,
  { icon: string; value: string }
> = {
  income: {
    icon: 'bg-income/10 text-income',
    value: 'text-income',
  },
  primary: {
    icon: 'bg-primary/10 text-primary',
    value: 'text-primary',
  },
  purple: {
    icon: 'bg-violet-500/10 text-violet-400',
    value: 'text-violet-400',
  },
  warning: {
    icon: 'bg-amber-500/10 text-amber-400',
    value: 'text-amber-400',
  },
}
