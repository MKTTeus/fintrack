import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { queryKeys } from '@/lib/query-keys'
import { setInvestmentOpeningBalance, type InvestmentPosition } from './investment.service'

export function InvestmentOpeningDialog({
  position, onClose,
}: { position: InvestmentPosition; onClose: () => void }) {
  const client = useQueryClient()
  const [amount, setAmount] = useState('')
  const [asOfDate, setAsOfDate] = useState('')
  const [error, setError] = useState('')
  const save = useMutation({
    mutationFn: () => {
      const parsed = Number(amount.trim().replace(/\./g, '').replace(',', '.'))
      return setInvestmentOpeningBalance(position.id, parsed, asOfDate)
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.investments.positions }),
        client.invalidateQueries({ queryKey: ['investments'] }),
        client.invalidateQueries({ queryKey: queryKeys.dashboard.summary }),
        client.invalidateQueries({ queryKey: queryKeys.dashboard.metrics }),
      ])
      onClose()
    },
  })

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    try { await save.mutateAsync() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não consegui registrar o saldo inicial.') }
  }

  return <Dialog open onOpenChange={open => { if (!open && !save.isPending) onClose() }}>
    <DialogContent className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Saldo inicial — {position.name}</DialogTitle>
        <DialogDescription>
          Informe o valor que já estava investido na data escolhida. Isso não é uma aplicação nova
          e não altera o dinheiro disponível nas carteiras. Esta configuração só pode ser feita uma vez.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="opening-balance">Valor que já estava investido (R$)</Label>
          <Input id="opening-balance" inputMode="decimal" required value={amount}
            onChange={e => setAmount(e.target.value)} placeholder="Ex.: 350,00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opening-as-of">Saldo existente até o final de</Label>
          <Input id="opening-as-of" required type="date" value={asOfDate}
            onChange={e => setAsOfDate(e.target.value)} />
        </div>
        <p className="text-xs text-muted-foreground">
          Exemplo: para importar movimentações a partir de 01/10, informe o saldo que já existia
          em 30/09. Não use o saldo atual nem invente rendimentos.
        </p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>Cancelar</Button>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Salvando…' : 'Registrar saldo inicial'}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
}