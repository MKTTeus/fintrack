import { useState } from 'react'

import { CalendarDays, FunnelX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  periodOptions,
  typeOptions,
} from '../constants/report-options'
import type {
  ReportFilterOptions,
  ReportFilters,
  ReportSelectOption,
} from '../types/report.types'

import { ExportReportDialog } from './export-report-dialog'
import { CustomPeriodPicker } from './custom-period-picker'

interface FilterSelectProps {
  label: string
  value: string
  options: ReportSelectOption[]
  onValueChange: (value: string) => void
  withIcon?: boolean
}

function FilterSelect({
  label,
  value,
  options,
  onValueChange,
  withIcon = false,
}: FilterSelectProps) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="h-10 w-full justify-between rounded-xl border-border bg-background/40 px-3">
          <span className="flex min-w-0 items-center gap-2">
            {withIcon ? (
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            ) : null}
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface ReportsFiltersProps {
  filterOptions: ReportFilterOptions
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
}

export function ReportsFilters({
  filterOptions,
  filters,
  onFiltersChange,
}: ReportsFiltersProps) {
  const [isCustomPeriodOpen, setIsCustomPeriodOpen] =
    useState(false)

  function updateFilter(
    key: keyof ReportFilters,
    value: string,
  ) {
    if (key === 'period' && value === 'custom') {
      onFiltersChange({
        ...filters,
        period: value,
      })
      setIsCustomPeriodOpen(true)
      return
    }

    onFiltersChange({
      ...filters,
      [key]: value,
      ...(key === 'period'
        ? {
            customStartDate: undefined,
            customEndDate: undefined,
          }
        : {}),
    })
  }

  function clearFilters() {
    onFiltersChange({
      period: 'this-month',
      type: 'all',
      walletId: 'all',
      category: 'all',
      customStartDate: undefined,
      customEndDate: undefined,
    })
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-4">
      <div className="grid grid-cols-2 items-end gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(8rem,0.85fr)_minmax(8rem,0.85fr)]">
        {filters.period === 'custom' ? (
          <div className="grid min-w-0 gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Período
            </span>
            <CustomPeriodPicker
              filters={filters}
              onFiltersChange={onFiltersChange}
              open={isCustomPeriodOpen}
              onOpenChange={setIsCustomPeriodOpen}
            />
          </div>
        ) : (
          <FilterSelect
            label="Período"
            value={filters.period}
            options={periodOptions}
            onValueChange={(value) =>
              updateFilter('period', value)
            }
            withIcon
          />
        )}
        <FilterSelect
          label="Tipo"
          value={filters.type}
          options={typeOptions}
          onValueChange={(value) =>
            updateFilter('type', value)
          }
        />
        <FilterSelect
          label="Carteira"
          value={filters.walletId}
          options={filterOptions.wallets}
          onValueChange={(value) =>
            updateFilter('walletId', value)
          }
        />
        <FilterSelect
          label="Categoria"
          value={filters.category}
          options={filterOptions.categories}
          onValueChange={(value) =>
            updateFilter('category', value)
          }
        />

        <Button
          variant="outline"
          size="lg"
          className="col-span-2 h-10 w-full lg:col-span-1"
          onClick={clearFilters}
        >
          <FunnelX className="size-4" />
          Limpar filtros
        </Button>

        <ExportReportDialog
          filterOptions={filterOptions}
          initialFilters={filters}
          triggerClassName="col-span-2 h-10 w-full lg:col-span-1"
        />
      </div>
    </section>
  )
}
