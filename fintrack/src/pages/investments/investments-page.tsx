import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownToLine, ArrowUpFromLine, Landmark, Plus, TrendingUp } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWallets } from '@/features/wallets/hooks/use-wallets'
import { formatCurrency } from '@/utils/transaction-formatters'
import { createInvestment, createInvestmentMovement, investmentBalance, listInvestmentMovements, listInvestments, type InvestmentPosition } from '@/features/investments/investment.service'
import { queryKeys } from '@/lib/query-keys'

const investmentTypes = { cdb: 'CDB', rdb: 'RDB / Caixinha', fixed_income_other: 'Outros de renda fixa' }
const operationTypes = { application: 'Aplicação', redemption: 'Resgate', yield: 'Rendimento creditado no investimento' }
type InvestmentType = keyof typeof investmentTypes
type OperationType = keyof typeof operationTypes

function localToday() {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

export function InvestmentsPage() {
  const client = useQueryClient()
  const { wallets } = useWallets()
  const usableWallets = wallets.filter(w => w.type !== 'credit_card' && !w.id.startsWith('group-'))
  const positions = useQuery({ queryKey: ['investments', 'positions'], queryFn: listInvestments })
  const movements = useQuery({ queryKey: ['investments', 'movements'], queryFn: listInvestmentMovements })
  const records = positions.data ?? []
  const ledger = movements.data ?? []
  const total = useMemo(() => records.reduce((s, p) => s + investmentBalance(p.id, ledger), 0), [records, ledger])
  const applied = ledger.filter(m => m.kind === 'application').reduce((s, m) => s + Number(m.amount), 0)
  const redeemed = ledger.filter(m => m.kind === 'redemption').reduce((s, m) => s + Number(m.amount), 0)
  const yields = ledger.filter(m => m.kind === 'yield').reduce((s, m) => s + Number(m.amount), 0)
  const [createOpen, setCreateOpen] = useState(false)
  const [operationOpen, setOperationOpen] = useState(false)
  const [name, setName] = useState('')
  const [institution, setInstitution] = useState('')
  const [kind, setKind] = useState<InvestmentType>('cdb')
  const [positionId, setPositionId] = useState('')
  const [walletId, setWalletId] = useState('')
  const [operation, setOperation] = useState<OperationType>('application')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(localToday)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['investments'] }),
      client.invalidateQueries({ queryKey: queryKeys.wallets.list }),
      client.invalidateQueries({ queryKey: queryKeys.dashboard.summary }),
      client.invalidateQueries({ queryKey: queryKeys.dashboard.metrics }),
    ])
  }
  const addPosition = useMutation({ mutationFn: createInvestment, onSuccess: refresh })
  const addMovement = useMutation({ mutationFn: createInvestmentMovement, onSuccess: refresh })
  async function submitPosition(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await addPosition.mutateAsync({ name: name.trim(), institution: institution.trim() || null, kind, notes: null })
      setCreateOpen(false)
      setName('')
      setInstitution('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao cadastrar investimento.') }
  }
  async function submitMovement(e: FormEvent) {
    e.preventDefault()
    setError('')
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001) {
      setError('Informe um valor maior que zero, com até duas casas decimais.')
      return
    }
    const p = records.find(r => r.id === positionId)
    if (!p || !walletId) { setError('Escolha investimento e carteira.') ; return }
    if (operation === 'redemption' && value > investmentBalance(positionId, ledger) + 0.001) {
      setError('O resgate não pode exceder o saldo registrado nesse investimento.')
      return
    }
    try {
      await addMovement.mutateAsync({ position_id: positionId, wallet_id: walletId, kind: operation, amount: Math.round(value * 100) / 100, movement_date: date, notes: notes.trim() || null })
      setOperationOpen(false)
      setAmount('')
      setNotes('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao registrar operação.') }
  }
  function openOperation(p?: InvestmentPosition) {
    setError('')
    setPositionId(p?.id ?? records[0]?.id ?? '')
    setWalletId(usableWallets[0]?.id ?? '')
    setAmount('')
    setNotes('')
    setOperation('application')
    setOperationOpen(true)
  }
  return <AppLayout>
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Seus investimentos</h1>
          <p className="text-sm text-muted-foreground">Registre aplicações, resgates e rendimentos sem confundi-los com receitas e despesas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { setError(''); setCreateOpen(true) }}><Plus /> Novo investimento</Button>
          <Button onClick={() => openOperation()} disabled={!records.length || !usableWallets.length}><ArrowUpFromLine /> Registrar operação</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Saldo investido registrado', value: total, icon: Landmark },
          { label: 'Total aplicado', value: applied, icon: ArrowUpFromLine },
          { label: 'Total resgatado', value: redeemed, icon: ArrowDownToLine },
          { label: 'Rendimentos registrados', value: yields, icon: TrendingUp },
        ].map(s => <Card key={s.label}><CardHeader><CardTitle className="text-xs text-muted-foreground">{s.label}</CardTitle></CardHeader><CardContent><s.icon className="mb-2 size-5 text-primary"/><p className="text-xl font-semibold tabular-nums sm:text-2xl">{formatCurrency(s.value)}</p></CardContent></Card>)}
      </div>
      <p className="text-xs text-muted-foreground">Valores registrados manualmente; não são cotações bancárias ao vivo. Aplicação e resgate afetam o saldo estimado da carteira de origem/destino. Rendimento creditado aumenta apenas a posição investida.</p>
      {positions.isError || movements.isError ? <p role="alert" className="text-sm text-destructive">Erro ao consultar investimentos. Verifique a conexão com o banco.</p> : null}
      {positions.isPending || movements.isPending ? <div className="h-40 animate-pulse rounded-xl bg-muted"/> : records.length === 0 ? <Card><CardContent className="py-10 text-center"><Landmark className="mx-auto mb-3 size-9 text-muted-foreground"/><p className="font-semibold">Nenhum investimento cadastrado</p><p className="mt-1 text-sm text-muted-foreground">Comece criando seu CDB ou RDB. Nenhum lançamento anterior será alterado.</p></CardContent></Card> :
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {records.map(p => <Card key={p.id}>
          <CardHeader><CardTitle>{p.name}</CardTitle><p className="text-xs text-muted-foreground">{investmentTypes[p.kind]} · {p.institution || 'Instituição não informada'}</p></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-xs text-muted-foreground">Saldo registrado</p><p className="text-2xl font-semibold tabular-nums">{formatCurrency(investmentBalance(p.id, ledger))}</p></div>
            <Button className="w-full" variant="outline" onClick={() => openOperation(p)}>Registrar movimentação</Button>
          </CardContent>
        </Card>)}
      </div>}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Histórico de operações</h2>
        {!ledger.length ? <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada.</p> :
          <div className="overflow-hidden rounded-xl border border-border">{ledger.map(m => <div key={m.id} className="flex items-center justify-between gap-3 border-b border-border px-3 py-3 text-sm last:border-b-0 sm:px-4">
            <div className="min-w-0"><p className="truncate font-medium">{operationTypes[m.kind]}</p><p className="truncate text-xs text-muted-foreground">{records.find(p => p.id === m.position_id)?.name ?? 'Investimento'} · {m.movement_date.split('-').reverse().join('/')}</p></div>
            <span className="shrink-0 font-semibold tabular-nums">{formatCurrency(Number(m.amount))}</span>
          </div>)}</div>}
      </section>
    </div>
    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Novo investimento</DialogTitle><DialogDescription>Cadastre um CDB, RDB ou outro produto de renda fixa. Você poderá registrar aplicações depois.</DialogDescription></DialogHeader>
      <form onSubmit={submitPosition} className="space-y-4">
        <label className="block space-y-1 text-sm">Nome<Input required minLength={2} maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: RDB Nubank" /></label>
        <label className="block space-y-1 text-sm">Tipo<Select value={kind} onValueChange={v => setKind(v as InvestmentType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(investmentTypes).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></label>
        <label className="block space-y-1 text-sm">Instituição (opcional)<Input maxLength={100} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Ex.: Nubank"/></label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={addPosition.isPending} className="w-full">{addPosition.isPending ? 'Salvando...' : 'Criar investimento'}</Button>
      </form></DialogContent></Dialog>
    <Dialog open={operationOpen} onOpenChange={setOperationOpen}><DialogContent><DialogHeader><DialogTitle>Registrar operação</DialogTitle><DialogDescription>Aplicações reduzem o dinheiro disponível, resgates retornam à carteira e rendimentos aumentam o investimento sem registrar receita.</DialogDescription></DialogHeader>
      <form onSubmit={submitMovement} className="space-y-4">
        <label className="block space-y-1 text-sm">Investimento<Select value={positionId} onValueChange={setPositionId}><SelectTrigger><SelectValue placeholder="Escolha o investimento"/></SelectTrigger><SelectContent>{records.map(p => <SelectItem value={p.id} key={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></label>
        <label className="block space-y-1 text-sm">Operação<Select value={operation} onValueChange={v => setOperation(v as OperationType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(operationTypes).map(([k,v]) => <SelectItem value={k} key={k}>{v}</SelectItem>)}</SelectContent></Select></label>
        <label className="block space-y-1 text-sm">Carteira de origem ou destino<Select value={walletId} onValueChange={setWalletId}><SelectTrigger><SelectValue placeholder="Escolha uma carteira"/></SelectTrigger><SelectContent>{usableWallets.map(w => <SelectItem value={w.id} key={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0 space-y-1 text-sm">Valor (R$)<Input required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100,00"/></label>
          <label className="block min-w-0 space-y-1 text-sm">Data<Input required type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        </div>
        <label className="block space-y-1 text-sm">Observação (opcional)<Input value={notes} maxLength={200} onChange={e => setNotes(e.target.value)} /></label>
        <p className="text-xs text-muted-foreground">Saldo da aplicação: {formatCurrency(investmentBalance(positionId, ledger))}. Um resgate não pode superar o saldo registrado.</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={addMovement.isPending}>{addMovement.isPending ? 'Registrando...' : 'Registrar operação'}</Button>
      </form></DialogContent></Dialog>
  </AppLayout>
}
