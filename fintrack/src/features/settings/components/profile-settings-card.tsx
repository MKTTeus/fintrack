import { useState } from 'react'

import { UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/auth-context'

import type { SettingsCardBaseProps } from '../types/settings.types'

import { SettingsSectionCard } from './settings-section-card'

export function ProfileSettingsCard({
  isSaving,
  settings,
  onUpdate,
}: SettingsCardBaseProps) {
  const { user } = useAuth()
  const [name, setName] = useState(settings.display_name)
  const [savedDisplayName, setSavedDisplayName] = useState(
    settings.display_name,
  )
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  if (settings.display_name !== savedDisplayName) {
    setSavedDisplayName(settings.display_name)
    setName(settings.display_name)
  }

  const email = user?.email ?? ''
  const trimmedName = name.trim()
  const hasChanges = trimmedName !== settings.display_name

  async function handleSave() {
    if (!trimmedName || !hasChanges) {
      return
    }

    setFeedback('')
    setError('')

    try {
      await onUpdate({ display_name: trimmedName })
      setFeedback('Alterações salvas com sucesso.')
    } catch {
      setError('Não foi possível salvar suas alterações. Tente novamente.')
    }
  }

  return (
    <SettingsSectionCard
      icon={UserRound}
      title="Perfil"
      description="Gerencie suas informações pessoais"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="settings-name">Nome</Label>
            <Input
              id="settings-name"
              value={name}
              disabled={isSaving}
              onChange={(event) => {
                setName(event.target.value)
                setFeedback('')
                setError('')
              }}
              className="h-10 rounded-xl bg-background/40"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="settings-email">E-mail</Label>
            <Input
              id="settings-email"
              type="email"
              value={email}
              readOnly
              disabled
              className="h-10 rounded-xl bg-background/40"
            />
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={isSaving || !hasChanges || !trimmedName}
          onClick={handleSave}
          className="h-10 w-full px-5 xl:w-auto"
        >
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>

      {feedback ? (
        <p className="mt-3 text-xs text-primary">{feedback}</p>
      ) : null}

      {error ? (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      ) : null}
    </SettingsSectionCard>
  )
}
