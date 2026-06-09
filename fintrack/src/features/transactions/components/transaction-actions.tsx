import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useDeleteTransaction } from '../hooks/use-delete-transaction'
import { TransactionEditForm } from './transaction-edit-form'

import type { Transaction } from '../types/transaction.types'

interface TransactionActionsProps {
  transaction: Transaction
}

export function TransactionActions({
  transaction,
}: TransactionActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutateAsync: deleteAsync, isPending } =
    useDeleteTransaction()

  async function handleDelete() {
    try {
      await deleteAsync(transaction.id)
      setIsDeleteOpen(false)
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditOpen(true)}
          className="h-8 w-8 p-0"
          title="Editar transação"
        >
          <Edit2 className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          title="Deletar transação"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium tracking-tight">
              Editar transação
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Atualize os detalhes da transação
            </DialogDescription>
          </DialogHeader>

          <TransactionEditForm
            transaction={transaction}
            onClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm rounded-3xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium tracking-tight">
              Deletar transação?
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Tem certeza que quer deletar "{transaction.title}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPending}
              className="rounded-2xl"
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-2xl"
            >
              {isPending ? 'Deletando...' : 'Deletar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
