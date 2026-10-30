import { useState, type FormEvent } from 'react'
import { Scale } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { WalletItem } from '../types/wallet.types'

export function WalletReconciliationDialog({ wallet }: { wallet: WalletItem }) {
  const [open, setOpen] = useState(false)
  const [balance, setBalance] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const client = useQueryClient()
  const history = useQuery({
    queryKey: ['wallet-reconciliations', user?.id, wallet.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error: queryError } = await supabase.from('wallet_balance_reconciliations')
        .select('*').eq('user_id', user!.id).eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false }).limit(10)
      if (queryError) throw queryError
      return data
    },
  })
  const save = useMutation({
    mutationFn: async (actual: number) => {
      const { data, error: mutationError } = await supabase.rpc('reconcile_wallet_balance', {
        p_wallet_id: wallet.id,
        p_actual_balance: actual,
        p_note: note.trim() || null,
      })
      if (mutationError) throw mutationError
      return data
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['wallets'] }),
        client.invalidateQueries({ queryKey: ['wallet-reconciliations', user?.id, wallet.id] }),
        client.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
      setBalance('')
      setNote('')
      setOpen(false)
    },
  })
  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = Number(balance.replace(',', '.'))
    if (!balance.trim() || !Number.isFinite(parsed) || Math.abs(parsed * 100 - Math.round(parsed * 100)) > 1e-7) {
      setError('Informe um saldo válido com até duas casas decimais.')
      return
    }
    try { await save.mutateAsync(parsed) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao conciliar saldo.') }
  }
  const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant="outline" className="h-9 gap-1.5 rounded-xl"><Scale className="size-3.5" /> Conferir saldo</Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-2xl">
      <DialogHeader>
        <DialogTitle>Conferir saldo — {wallet.name}</DialogTitle>
        <DialogDescription>Registre o saldo real que aparece no banco agora. O FinTrack guarda o ajuste e preserva todas as movimentações antigas. Não use para corrigir um lançamento que deveria ser editado.</DialogDescription>
      </DialogHeader>
      <p className="rounded-xl bg-muted p-3 text-sm">Saldo estimado atual: <strong>{wallet.currentValue}</strong></p>
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid gap-1.5"><Label htmlFor={`reconcile-${wallet.id}`}>Saldo real (R$)</Label><Input id={`reconcile-${wallet.id}`} inputMode="decimal" placeholder="Ex.: 250,35" value={balance} onChange={e => setBalance(e.target.value)} required /></div>
        <div className="grid gap-1.5"><Label htmlFor={`reconcile-note-${wallet.id}`}>Observação (opcional)</Label><Input id={`reconcile-note-${wallet.id}`} maxLength={500} value={note} onChange={e => setNote(e.target.value)} placeholder="Conferência com extrato" /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Salvando...' : 'Registrar conferência'}</Button>
      </form>
      <section className="space-y-2 border-t pt-3"><h3 className="text-sm font-semibold">Últimas conferências</h3>
        {history.isLoading ? <p className="text-xs text-muted-foreground">Carregando histórico...</p>
          : history.isError ? <p role="alert" className="text-xs text-destructive">Não foi possível carregar o histórico.</p>
          : !history.data?.length ? <p className="text-xs text-muted-foreground">Nenhuma conferência registrada.</p>
          : <div className="max-h-44 space-y-2 overflow-y-auto">{history.data.map(row => <div key={row.id} className="rounded-lg border p-2 text-xs">
            <div className="flex justify-between gap-2"><span>{new Date(row.created_at).toLocaleString('pt-BR')}</span><strong>{money(Number(row.actual_balance))}</strong></div>
            <p className="text-muted-foreground">Antes: {money(Number(row.estimated_before))} · Ajuste: {money(Number(row.adjustment))}</p>
            {row.note && <p className="mt-1 break-words">{row.note}</p>}
          </div>)}</div>}
      </section>
    </DialogContent>
  </Dialog>
}
