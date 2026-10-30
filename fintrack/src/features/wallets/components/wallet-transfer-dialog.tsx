import { useState, type FormEvent } from 'react'
import { ArrowLeftRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { WalletItem } from '../types/wallet.types'
import { useWalletTransfers } from '../hooks/use-wallet-transfers'

function localToday() {
  return new Date().toLocaleDateString('en-CA')
}

export function WalletTransferDialog({ wallets }: { wallets: WalletItem[] }) {
  const eligible = wallets.filter(wallet => wallet.type !== 'credit_card')
  const { create } = useWalletTransfers()
  const [open, setOpen] = useState(false)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(localToday)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const value = Number(amount)
    if (!origin || !destination || origin === destination || !Number.isFinite(value) || value <= 0) {
      setError('Selecione duas carteiras diferentes e um valor maior que zero.')
      return
    }
    try {
      await create.mutateAsync({
        source_wallet_id: origin, destination_wallet_id: destination,
        amount: value, transfer_date: date,
        notes: note.trim().slice(0, 500) || null,
      })
      setOpen(false)
      setOrigin(''); setDestination(''); setAmount(''); setNote('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível transferir.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 rounded-xl" disabled={eligible.length < 2}>
          <ArrowLeftRight className="size-4" /> Transferir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Transferência entre carteiras</DialogTitle>
          <DialogDescription>
            Uma transferência não é receita nem despesa. O valor sai de uma conta e entra na outra.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Origem</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Escolha a carteira de origem" /></SelectTrigger>
              <SelectContent>{eligible.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Destino</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Escolha a carteira de destino" /></SelectTrigger>
              <SelectContent>{eligible.filter(w => w.id !== origin).map(w =>
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              )}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="transfer-amount">Valor (R$)</Label>
              <Input id="transfer-amount" type="number" min="0.01" step="0.01"
                inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)}
                placeholder="0,00" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transfer-date">Data</Label>
              <Input id="transfer-date" type="date" value={date}
                onChange={e=>setDate(e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="transfer-note">Descrição (opcional)</Label>
            <Input id="transfer-note" value={note} maxLength={500}
              onChange={e=>setNote(e.target.value)} placeholder="Ex.: reserva de emergência" />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="h-11 w-full rounded-xl" type="submit" disabled={create.isPending}>
            {create.isPending ? 'Transferindo...' : 'Confirmar transferência'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
