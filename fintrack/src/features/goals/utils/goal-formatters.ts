import {
  Dumbbell,
  Flag,
  Flame,
  Home,
  Laptop,
  Plane,
  Star,
  Target,
  Trophy,
  Umbrella,
  Wallet,
} from 'lucide-react'

import type {
  Goal,
  GoalAchievement,
  GoalDeposit,
  GoalDepositRecord,
  GoalProgressPoint,
  GoalRecord,
  GoalSummary,
  GoalTone,
} from '../types/goal.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
})

const fullMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const goalIconMap = {
  dumbbell: Dumbbell,
  flag: Flag,
  home: Home,
  laptop: Laptop,
  plane: Plane,
  target: Target,
  umbrella: Umbrella,
} as const

const goalToneByColor: Record<string, GoalTone> = {
  amber: 'amber',
  blue: 'blue',
  green: 'green',
  pink: 'pink',
  purple: 'purple',
  red: 'pink',
  violet: 'purple',
  yellow: 'amber',
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCurrency(value: number) {
  const absoluteValue = Math.abs(value)
  const prefix = value < 0 ? '-R$' : 'R$'

  if (absoluteValue >= 1_000_000) {
    return `${prefix} ${formatCompactNumber(absoluteValue / 1_000_000)} mi`
  }

  if (absoluteValue >= 1_000) {
    return `${prefix} ${formatCompactNumber(absoluteValue / 1_000)} mil`
  }

  return formatCurrency(value)
}

export function getGoalProgress(goal: Goal) {
  if (goal.targetAmount <= 0) {
    return 0
  }

  return Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100,
  )
}

export function getRemainingAmount(goal: Goal) {
  return Math.max(goal.targetAmount - goal.currentAmount, 0)
}

export function formatPercent(value: number) {
  return `${value}%`
}

function getGoalIcon(icon: string | null) {
  if (!icon) {
    return Target
  }

  return goalIconMap[icon as keyof typeof goalIconMap] ?? Target
}

function getGoalTone(color: string | null): GoalTone {
  if (!color) {
    return 'blue'
  }

  return goalToneByColor[color] ?? 'blue'
}

function formatGoalDate(date: string | null) {
  if (!date) {
    return 'Não informado'
  }

  return dateFormatter.format(new Date(`${date}T00:00:00`))
}

function goalDepositToItem(
  deposit: GoalDepositRecord,
): GoalDeposit {
  return {
    id: deposit.id,
    month: fullMonthFormatter.format(
      new Date(`${deposit.deposit_date}T00:00:00`),
    ),
    amount: deposit.amount,
    date: deposit.deposit_date,
    notes: deposit.notes,
    walletId: deposit.wallet_id,
  }
}

function buildProgressHistory(
  deposits: GoalDepositRecord[],
): GoalProgressPoint[] {
  const monthlyTotals = new Map<string, number>()

  deposits.forEach((deposit) => {
    const date = new Date(`${deposit.deposit_date}T00:00:00`)
    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}`
    const currentAmount = monthlyTotals.get(key) ?? 0

    monthlyTotals.set(key, currentAmount + deposit.amount)
  })

  let cumulativeAmount = 0

  return Array.from(monthlyTotals.entries())
    .sort(([firstKey], [secondKey]) =>
      firstKey.localeCompare(secondKey),
    )
    .map(([key, amount]) => {
      cumulativeAmount += amount
      const [year, month] = key.split('-')

      return {
        month: monthFormatter.format(
          new Date(Number(year), Number(month) - 1, 1),
        ),
        amount: cumulativeAmount,
      }
    })
}

export function goalToGoalItem(
  goal: GoalRecord,
  deposits: GoalDepositRecord[],
): Goal {
  const goalDeposits = deposits.filter(
    (deposit) => deposit.goal_id === goal.id,
  )
  const currentAmount = goalDeposits.reduce(
    (total, deposit) => total + deposit.amount,
    0,
  )

  return {
    id: goal.id,
    walletId: goal.wallet_id,
    title: goal.title,
    description: goal.description || 'Sem descrição cadastrada',
    currentAmount,
    targetAmount: goal.target_amount,
    monthlyTarget: goal.monthly_target ?? 0,
    targetDate: goal.target_date,
    dueLabel: formatGoalDate(goal.target_date),
    icon: getGoalIcon(goal.icon),
    iconName: goal.icon ?? 'target',
    color: goal.color,
    tone: getGoalTone(goal.color),
    status:
      currentAmount >= goal.target_amount
        ? 'completed'
        : goal.status,
    deposits: goalDeposits
      .slice()
      .sort((first, second) =>
        second.deposit_date.localeCompare(first.deposit_date),
      )
      .map(goalDepositToItem),
    progressHistory: buildProgressHistory(goalDeposits),
    raw: goal,
  }
}

export function getGoalSummaries(goals: Goal[]): GoalSummary[] {
  const activeGoals = goals.filter(
    (goal) => goal.status === 'active',
  )
  const completedGoals = goals.filter(
    (goal) => goal.status === 'completed',
  )
  const totalTarget = activeGoals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  )
  const averageProgress = activeGoals.length
    ? Math.round(
        activeGoals.reduce(
          (total, goal) => total + getGoalProgress(goal),
          0,
        ) / activeGoals.length,
      )
    : 0

  return [
    {
      title: 'Meta total',
      value: formatCompactCurrency(totalTarget),
      fullValue: formatCurrency(totalTarget),
      detail: 'Valor de todas as metas',
      icon: Target,
      variant: 'income',
    },
    {
      title: 'Progresso médio',
      value: `${averageProgress}%`,
      detail: 'Média de conclusão',
      icon: Flag,
      variant: 'primary',
    },
    {
      title: 'Metas ativas',
      value: String(activeGoals.length),
      detail: 'Em andamento',
      icon: Target,
      variant: 'purple',
    },
    {
      title: 'Concluídas',
      value: String(completedGoals.length),
      detail: 'Metas alcançadas',
      icon: Trophy,
      variant: 'warning',
    },
  ]
}

export function getGoalAchievements(
  goals: Goal[],
  deposits: GoalDepositRecord[],
): GoalAchievement[] {
  const activeGoals = goals.filter(
    (goal) => goal.status === 'active',
  )
  const activeGoalIds = new Set(
    activeGoals.map((goal) => goal.id),
  )
  const activeGoalDeposits = deposits.filter((deposit) =>
    activeGoalIds.has(deposit.goal_id),
  )
  const completedGoals = goals.filter(
    (goal) => goal.status === 'completed',
  )
  const totalSaved = activeGoalDeposits.reduce(
    (total, deposit) => total + deposit.amount,
    0,
  )
  const nextGoal = activeGoals
    .slice()
    .sort(
      (firstGoal, secondGoal) =>
        getRemainingAmount(firstGoal) -
        getRemainingAmount(secondGoal),
    )[0]

  return [
    {
      title: 'Metas concluídas',
      value: String(completedGoals.length),
      detail: completedGoals.length
        ? 'Continue assim!'
        : 'Nenhuma ainda',
      icon: Trophy,
      tone: 'green',
    },
    {
      title: 'Total economizado',
      value: formatCurrency(totalSaved),
      detail: 'Em todas as metas',
      icon: Wallet,
      tone: 'blue',
    },
    {
      title: 'Sequência atual',
      value:
        activeGoalDeposits.length > 0 ? '1 mês' : '0 meses',
      detail: 'Depósitos consecutivos',
      icon: Flame,
      tone: 'purple',
    },
    {
      title: 'Próxima meta',
      value: nextGoal?.title ?? 'Nenhuma meta',
      detail: nextGoal
        ? `Faltam ${formatCurrency(getRemainingAmount(nextGoal))}`
        : 'Crie uma meta ativa',
      icon: Star,
      tone: 'amber',
    },
  ]
}
