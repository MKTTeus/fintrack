import { useState, type FormEvent } from 'react'
import { CreditCard } from 'lucide-react'
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
import { useCreditCardPayments } from '../hooks/use-credit-card-payments'

export function CreditCardPaymentDialog({
  cardWallet, wallets,
}: { cardWallet: WalletItem; wallets: WalletItem[] }) {
  const sources = wallets.filter(w => w.type !== 'credit_card')
  const { create } = useCreditCardPayments()
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [error, setError] = useState('')

  const canUse = Boolean(cardWallet.creditCard) && sources.length > 0
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(amount)
    if (!source || !cardWallet.creditCard || !Number.isFinite(value) || value <= 0) {
      setError('Informe a conta pagadora e um valor maior que zero.')
      return
    }
    const outstanding = cardWallet.outstandingAmount ?? 0
    if (value > outstanding + 0.001) {
      setError('O valor informado excede o total registrado como em aberto neste cartão.')
      return
    }
    setError('')
    try {
      await create.mutateAsync({
        credit_card_id: cardWallet.creditCard.id,
        source_wallet_id: source,
        amount: value,
        payment_date: date,
        notes: null,
      })
      setOpen(false); setSource(''); setAmount('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível registrar o pagamento.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-1.5 rounded-xl" disabled={!canUse}>
          <CreditCard className="size-4" /> Registrar pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Pagamento de cartão</DialogTitle>
          <DialogDescription>
            Abate a dívida e o saldo da conta pagadora. Não gera outra despesa no relatório.
            Confira se o pagamento ainda não foi lançado no histórico.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-xl bg-muted/50 px-3 py-2 text-sm">
          Total em aberto registrado: <strong>{cardWallet.currentValue}</strong>
        </p>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Conta utilizada no pagamento</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Selecione a carteira" /></SelectTrigger>
              <SelectContent>{sources.map(w=><SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="card-pay-amount">Valor (R$)</Label>
              <Input id="card-pay-amount" type="number" step="0.01" min="0.01" inputMode="decimal"
                value={amount} onChange={e=>setAmount(e.target.value)} required placeholder="0,00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-pay-date">Data</Label>
              <Input id="card-pay-date" type="date" required
                value={date} onChange={e=>setDate(e.target.value)} />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="h-11 rounded-xl" disabled={create.isPending || !canUse}>
            {create.isPending ? 'Registrando...' : 'Registrar pagamento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
