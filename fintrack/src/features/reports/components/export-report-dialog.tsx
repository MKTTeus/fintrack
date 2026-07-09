import { useMemo, useState } from 'react'

import { FileDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  periodOptions,
  reportContentOptions,
  typeOptions,
} from '../constants/report-options'
import type { ReportPdfSectionId } from '../pdf/report-pdf-types'
import type {
  ReportFilterOptions,
  ReportFilters,
  ReportSelectOption,
} from '../types/report.types'

import { CustomPeriodPicker } from './custom-period-picker'

interface ExportReportDialogProps {
  filterOptions: ReportFilterOptions
  initialFilters: ReportFilters
  triggerClassName?: string
}

interface DialogSelectProps {
  label: string
  value: string
  options: ReportSelectOption[]
  onValueChange: (value: string) => void
}

function DialogSelect({
  label,
  value,
  options,
  onValueChange,
}: DialogSelectProps) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="h-10 w-full justify-between rounded-xl bg-background/40">
          <SelectValue />
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
    </label>
  )
}

function getOptionLabel(
  options: ReportSelectOption[],
  value: string,
) {
  return (
    options.find((option) => option.value === value)?.label ??
    'Todos'
  )
}

export function ExportReportDialog({
  filterOptions,
  initialFilters,
  triggerClassName,
}: ExportReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCustomPeriodOpen, setIsCustomPeriodOpen] =
    useState(false)
  const [filters, setFilters] =
    useState<ReportFilters>(initialFilters)
  const [content, setContent] = useState<ReportPdfSectionId[]>(
    reportContentOptions.map(
      (option) => option.id as ReportPdfSectionId,
    ),
  )

  const selectedContentLabel = useMemo(
    () =>
      content.length === reportContentOptions.length
        ? 'Todos os blocos'
        : `${content.length} blocos selecionados`,
    [content],
  )
  const hasCompleteCustomPeriod =
    filters.period !== 'custom' ||
    (!!filters.customStartDate && !!filters.customEndDate)
  const isGenerateDisabled =
    isGenerating ||
    content.length === 0 ||
    !hasCompleteCustomPeriod

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setFilters(initialFilters)
    }

    setOpen(nextOpen)
  }

  function updateFilter(
    key: keyof ReportFilters,
    value: string,
  ) {
    if (key === 'period' && value === 'custom') {
      setFilters((current) => ({
        ...current,
        period: value,
      }))
      setIsCustomPeriodOpen(true)
      return
    }

    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === 'period'
        ? {
            customStartDate: undefined,
            customEndDate: undefined,
          }
        : {}),
    }))
  }

  function toggleContent(optionId: ReportPdfSectionId) {
    setContent((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    )
  }

  async function handleGeneratePDF() {
    if (isGenerateDisabled) {
      return
    }

    setIsGenerating(true)

    try {
      const { downloadReportPdf } = await import(
        '../pdf/report-download'
      )

      await downloadReportPdf({
        filters: {
          ...filters,
          categoryLabel: getOptionLabel(
            filterOptions.categories,
            filters.category,
          ),
          typeLabel: getOptionLabel(typeOptions, filters.type),
          walletLabel: getOptionLabel(
            filterOptions.wallets,
            filters.walletId,
          ),
        },
        selectedSections: content,
      })
      setOpen(false)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={triggerClassName ?? 'h-10'}
        >
          <FileDown className="size-4" />
          Exportar PDF
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exportar relatório</DialogTitle>
          <DialogDescription>
            Escolha quais dados deseja incluir no PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DialogSelect
              label="Período"
              value={filters.period}
              options={periodOptions}
              onValueChange={(value) =>
                updateFilter('period', value)
              }
            />
            <DialogSelect
              label="Tipo"
              value={filters.type}
              options={typeOptions}
              onValueChange={(value) =>
                updateFilter('type', value)
              }
            />
            <DialogSelect
              label="Carteiras"
              value={filters.walletId}
              options={filterOptions.wallets}
              onValueChange={(value) =>
                updateFilter('walletId', value)
              }
            />
            <DialogSelect
              label="Categorias"
              value={filters.category}
              options={filterOptions.categories}
              onValueChange={(value) =>
                updateFilter('category', value)
              }
            />
          </div>

          {filters.period === 'custom' ? (
            <div className="grid gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Intervalo personalizado
              </span>
              <CustomPeriodPicker
                filters={filters}
                onFiltersChange={setFilters}
                open={isCustomPeriodOpen}
                onOpenChange={setIsCustomPeriodOpen}
              />
            </div>
          ) : null}

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">
                Conteúdo do relatório
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedContentLabel}
              </span>
            </div>

            <div className="grid gap-2 rounded-2xl border border-border bg-background/30 p-3">
              {reportContentOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60"
                >
                  <input
                    type="checkbox"
                    checked={content.includes(
                      option.id as ReportPdfSectionId,
                    )}
                    onChange={() =>
                      toggleContent(
                        option.id as ReportPdfSectionId,
                      )
                    }
                    className="size-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
            Este relatório incluirá os dados do período
            selecionado, considerando os filtros aplicados.
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerateDisabled}
          >
            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
