import { Monitor, Moon, Paintbrush, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type {
  SettingsCardBaseProps,
  SettingsTheme,
} from '../types/settings.types'

import { SettingsSectionCard } from './settings-section-card'

const themeOptions: Array<{
  icon: typeof Sun
  label: string
  value: SettingsTheme
}> = [
  { icon: Sun, label: 'Claro', value: 'light' },
  { icon: Moon, label: 'Escuro', value: 'dark' },
  { icon: Monitor, label: 'Sistema', value: 'system' },
]

export function AppearanceSettingsCard({
  isSaving,
  settings,
  onUpdate,
}: SettingsCardBaseProps) {
  async function handleThemeChange(theme: SettingsTheme) {
    if (theme === settings.theme) {
      return
    }

    try {
      await onUpdate({ theme })
    } catch {
      // O cache e o tema são revertidos em settings-page.
    }
  }

  return (
    <SettingsSectionCard
      icon={Paintbrush}
      title="Aparência"
      description="Personalize a aparência do FinTrack"
    >
      <div className="grid gap-3 xl:max-w-3xl xl:grid-cols-[minmax(12rem,1fr)_minmax(22rem,1.6fr)] xl:items-center">
        <div>
          <p className="text-sm font-medium">Tema</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha o tema da aplicação
          </p>
        </div>

        <div className="grid rounded-xl border border-border bg-background/40 p-1 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = settings.theme === option.value

            return (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                size="lg"
                disabled={isSaving}
                onClick={() => handleThemeChange(option.value)}
                className={cn(
                  'h-10 rounded-lg text-muted-foreground hover:bg-muted/60',
                  isActive &&
                    'border border-primary/50 bg-primary/10 text-primary shadow-[0_0_0_1px_rgb(37_99_235/0.08)] hover:bg-primary/10 hover:text-primary',
                )}
              >
                <Icon className="size-4" />
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>
    </SettingsSectionCard>
  )
}
