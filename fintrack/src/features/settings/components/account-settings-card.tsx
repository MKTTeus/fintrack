import { useState } from 'react'

import { LogOut, Shield, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signOut } from '@/services/auth/auth.service'

import { useDeleteAccount } from '../hooks/use-delete-account'

import { SettingsSectionCard } from './settings-section-card'

const DELETE_CONFIRMATION_TEXT = 'EXCLUIR'

export function AccountSettingsCard() {
  const navigate = useNavigate()
  const deleteAccount = useDeleteAccount()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const isConfirmationValid =
    confirmationText.trim() === DELETE_CONFIRMATION_TEXT

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOut()
      navigate('/login')
    } finally {
      setIsSigningOut(false)
    }
  }

  function handleDeleteDialogChange(open: boolean) {
    setIsDeleteDialogOpen(open)

    if (!open) {
      setConfirmationText('')
      setDeleteError('')
    }
  }

  async function handleDeleteAccount() {
    if (!isConfirmationValid) {
      return
    }

    setDeleteError('')

    try {
      await deleteAccount.mutateAsync()
      navigate('/login')
    } catch {
      setDeleteError(
        'Não foi possível excluir sua conta. Tente novamente.',
      )
    }
  }

  return (
    <SettingsSectionCard
      icon={Shield}
      title="Conta"
      description="Gerencie sua conta e segurança"
    >
      <div className="divide-y divide-border/70">
        <div className="grid gap-4 py-1 pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-medium">Sair da conta</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Encerrar sessão no FinTrack
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSigningOut || deleteAccount.isPending}
            onClick={handleSignOut}
            className="h-10 w-full gap-2 rounded-xl bg-background/40 sm:w-auto"
          >
            <LogOut className="size-4" />
            {isSigningOut ? 'Saindo...' : 'Sair'}
          </Button>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-medium text-destructive">
              Excluir conta
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta ação não pode ser desfeita
            </p>
          </div>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={handleDeleteDialogChange}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={deleteAccount.isPending}
                className="h-10 w-full gap-2 rounded-xl border border-destructive/40 bg-transparent sm:w-auto"
              >
                <Trash2 className="size-4" />
                Excluir conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Excluir conta permanentemente?</DialogTitle>
                <DialogDescription>
                  Todos os seus dados no FinTrack serão removidos, incluindo
                  transações, carteiras, cartões, metas e configurações. Esta
                  ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2">
                <Label htmlFor="delete-account-confirmation">
                  Digite{' '}
                  <span className="font-medium text-foreground">
                    {DELETE_CONFIRMATION_TEXT}
                  </span>{' '}
                  para confirmar
                </Label>
                <Input
                  id="delete-account-confirmation"
                  value={confirmationText}
                  disabled={deleteAccount.isPending}
                  onChange={(event) => {
                    setConfirmationText(event.target.value)
                    setDeleteError('')
                  }}
                  placeholder={DELETE_CONFIRMATION_TEXT}
                  className="h-10 rounded-xl bg-background/40"
                />
              </div>

              {deleteError ? (
                <p className="text-xs text-destructive">{deleteError}</p>
              ) : null}

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={deleteAccount.isPending}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={
                    !isConfirmationValid || deleteAccount.isPending
                  }
                  onClick={handleDeleteAccount}
                >
                  {deleteAccount.isPending
                    ? 'Excluindo...'
                    : 'Excluir conta'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SettingsSectionCard>
  )
}
