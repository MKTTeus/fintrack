import { CircleDollarSign } from 'lucide-react'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import type {
  SettingsCardBaseProps,
  SettingsCurrency,
  SettingsDateFormat,
} from '../types/settings.types'

import { SettingsSectionCard } from './settings-section-card'

const currencyOptions: Array<{
  label: string
  value: SettingsCurrency
}> = [
  { label: 'Real (R$)', value: 'BRL' },
  { label: 'Dólar ($)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' },
]

const dateFormatOptions: Array<{
  label: string
  value: SettingsDateFormat
}> = [
  { label: 'dd/mm/aaaa', value: 'dd/MM/yyyy' },
  { label: 'mm/dd/yyyy', value: 'MM/dd/yyyy' },
]

export function FinancialPreferencesCard({
  isSaving,
  settings,
  onUpdate,
}: SettingsCardBaseProps) {
  async function handleCurrencyChange(value: SettingsCurrency) {
    if (value === settings.currency) {
      return
    }

    try {
      await onUpdate({ currency: value })
    } catch {
      // O cache é revertido em settings-page.
    }
  }

  async function handleShowCentsChange(checked: boolean) {
    if (checked === settings.show_cents) {
      return
    }

    try {
      await onUpdate({ show_cents: checked })
    } catch {
      // O cache é revertido em settings-page.
    }
  }

  async function handleDateFormatChange(value: SettingsDateFormat) {
    if (value === settings.date_format) {
      return
    }

    try {
      await onUpdate({ date_format: value })
    } catch {
      // O cache é revertido em settings-page.
    }
  }

  return (
    <SettingsSectionCard
      icon={CircleDollarSign}
      title="Preferências financeiras"
      description="Defina como o FinTrack deve funcionar para você"
    >
      <div className="grid gap-5 xl:max-w-2xl">
        <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_minmax(12rem,1fr)] sm:items-center">
          <Label htmlFor="settings-currency">Moeda padrão</Label>
          <Select
            value={settings.currency}
            disabled={isSaving}
            onValueChange={(value) =>
              handleCurrencyChange(value as SettingsCurrency)
            }
          >
            <SelectTrigger
              id="settings-currency"
              className="h-10 w-full rounded-xl bg-background/40"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_minmax(12rem,1fr)] sm:items-center">
          <div>
            <Label htmlFor="settings-cents">Mostrar centavos</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Exibir sempre os centavos nos valores
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <Switch
              id="settings-cents"
              checked={settings.show_cents}
              disabled={isSaving}
              className="data-[state=checked]:bg-primary"
              onCheckedChange={handleShowCentsChange}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_minmax(12rem,1fr)] sm:items-center">
          <div>
            <Label htmlFor="settings-date-format">
              Formato de data
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha o formato de exibição das datas
            </p>
          </div>
          <Select
            value={settings.date_format}
            disabled={isSaving}
            onValueChange={(value) =>
              handleDateFormatChange(value as SettingsDateFormat)
            }
          >
            <SelectTrigger
              id="settings-date-format"
              className="h-10 w-full rounded-xl bg-background/40"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateFormatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsSectionCard>
  )
}
