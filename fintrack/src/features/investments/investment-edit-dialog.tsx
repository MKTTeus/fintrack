import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { queryKeys } from '@/lib/query-keys'
import {
  updateInvestment,
  type InvestmentPosition,
  type UpdateInvestment,
} from './investment.service'

const investmentTypes: Record<InvestmentPosition['kind'], string> = {
  cdb: 'CDB',
  rdb: 'RDB / Caixinha',
  fixed_income_other: 'Outros de renda fixa',
}

interface InvestmentEditDialogProps {
  position: InvestmentPosition
  onClose: () => void
}

export function InvestmentEditDialog({ position, onClose }: InvestmentEditDialogProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(position.name)
  const [kind, setKind] = useState<InvestmentPosition['kind']>(position.kind)
  const [institution, setInstitution] = useState(position.institution ?? '')
  const [notes, setNotes] = useState(position.notes ?? '')
  const [error, setError] = useState('')

  const save = useMutation({
    mutationFn: (input: UpdateInvestment) => updateInvestment(position.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.investments.positions })
      onClose()
    },
  })

  const isChanged =
    name.trim() !== position.name ||
    kind !== position.kind ||
    institution.trim() !== (position.institution ?? '') ||
    notes.trim() !== (position.notes ?? '')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const trimmedName = name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError('O nome precisa ter entre 2 e 100 caracteres.')
      return
    }

    try {
      await save.mutateAsync({
        name: trimmedName,
        kind,
        institution: institution.trim() || null,
        notes: notes.trim() || null,
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar as alterações.')
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !save.isPending) onClose() }}>
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5 shrink-0 text-primary" />
            Editar investimento
          </DialogTitle>
          <DialogDescription>
            Corrija os dados de cadastro. Suas aplicações, resgates, rendimentos e saldos permanecem inalterados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="investment-edit-name">Nome do investimento</Label>
            <Input
              id="investment-edit-name"
              autoFocus
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: RDB Nubank"
            />
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="investment-edit-kind">Tipo</Label>
            <Select value={kind} onValueChange={(value) => setKind(value as InvestmentPosition['kind'])}>
              <SelectTrigger id="investment-edit-kind" className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(investmentTypes).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="investment-edit-institution">Instituição (opcional)</Label>
            <Input
              id="investment-edit-institution"
              maxLength={100}
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              placeholder="Ex.: Nubank"
            />
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="investment-edit-notes">Observações (opcional)</Label>
            <Textarea
              id="investment-edit-notes"
              className="min-h-24 resize-y rounded-xl"
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Informações adicionais sobre o investimento"
            />
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={save.isPending || !isChanged}>
              {save.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
