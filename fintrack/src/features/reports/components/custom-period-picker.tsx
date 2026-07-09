import { useMemo, useState } from 'react'

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'

import { Button } from '@/components/ui/button'

import type { ReportFilters } from '../types/report.types'
import { formatReportDate } from '../utils/report-formatters'

interface CustomPeriodPickerProps {
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SelectionStep = 'start' | 'end'

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseDateKey(value?: string) {
  if (!value) {
    return null
  }

  return new Date(`${value}T00:00:00`)
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getMonthDays(month: Date) {
  const firstDay = getMonthStart(month)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const days: Array<Date | null> = []

  for (let index = 0; index < startWeekday; index += 1) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(
      new Date(month.getFullYear(), month.getMonth(), day),
    )
  }

  return days
}

function getTriggerLabel(filters: ReportFilters) {
  if (filters.customStartDate && filters.customEndDate) {
    return `${formatReportDate(filters.customStartDate)} - ${formatReportDate(filters.customEndDate)}`
  }

  return 'Selecionar intervalo'
}

function getRangeState(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
) {
  if (!startDate || !endDate) {
    return {
      isInRange: false,
      isRangeEnd: false,
      isRangeStart: false,
    }
  }

  const time = date.getTime()
  const start = startDate.getTime()
  const end = endDate.getTime()

  return {
    isInRange: time > start && time < end,
    isRangeEnd: time === end,
    isRangeStart: time === start,
  }
}

export function CustomPeriodPicker({
  filters,
  onFiltersChange,
  open,
  onOpenChange,
}: CustomPeriodPickerProps) {
  const initialMonth =
    parseDateKey(filters.customStartDate) ?? new Date()
  const [visibleMonth, setVisibleMonth] = useState(
    getMonthStart(initialMonth),
  )
  const [selectionStep, setSelectionStep] =
    useState<SelectionStep>(
      filters.customStartDate && !filters.customEndDate
        ? 'end'
        : 'start',
    )
  const days = useMemo(
    () => getMonthDays(visibleMonth),
    [visibleMonth],
  )
  const startDate = parseDateKey(filters.customStartDate)
  const endDate = parseDateKey(filters.customEndDate)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth)

  function moveMonth(amount: number) {
    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1,
        ),
    )
  }

  function selectDate(date: Date) {
    const dateKey = toDateKey(date)

    if (
      selectionStep === 'start' ||
      !filters.customStartDate
    ) {
      onFiltersChange({
        ...filters,
        period: 'custom',
        customStartDate: dateKey,
        customEndDate: undefined,
      })
      setSelectionStep('end')
      return
    }

    if (
      filters.customStartDate &&
      dateKey < filters.customStartDate
    ) {
      onFiltersChange({
        ...filters,
        period: 'custom',
        customStartDate: dateKey,
        customEndDate: filters.customStartDate,
      })
    } else {
      onFiltersChange({
        ...filters,
        period: 'custom',
        customEndDate: dateKey,
      })
    }

    setSelectionStep('start')
    onOpenChange(false)
  }

  function clearRange() {
    onFiltersChange({
      ...filters,
      period: 'this-month',
      customStartDate: undefined,
      customEndDate: undefined,
    })
    setSelectionStep('start')
    onOpenChange(false)
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="h-10 w-full justify-between rounded-xl border-border bg-background/40 px-3 font-normal"
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {getTriggerLabel(filters)}
            </span>
          </span>
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[min(calc(100vw-2rem),22rem)] rounded-2xl bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95"
        >
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="text-sm font-medium capitalize">
              {monthLabel}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => moveMonth(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.72rem] text-muted-foreground">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(
              (day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ),
            )}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} />
              }

              const dateKey = toDateKey(date)
              const {
                isInRange,
                isRangeEnd,
                isRangeStart,
              } = getRangeState(date, startDate, endDate)

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => selectDate(date)}
                  className={`
                    flex
                    h-9
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    transition-colors
                    hover:bg-muted
                    ${
                      isRangeStart || isRangeEnd
                        ? 'bg-primary text-primary-foreground hover:bg-primary'
                        : ''
                    }
                    ${
                      isInRange
                        ? 'bg-primary/10 text-primary'
                        : ''
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background/40 p-3 text-xs text-muted-foreground">
            {filters.customStartDate
              ? filters.customEndDate
                ? getTriggerLabel(filters)
                : 'Selecione a data final.'
              : 'Selecione a data inicial.'}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearRange}
            >
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={
                !filters.customStartDate ||
                !filters.customEndDate
              }
            >
              Concluir
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
