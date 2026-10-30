import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWallets } from '@/features/wallets/hooks/use-wallets'
import { createFii, createFiiMovement, updateFii, listFiis, listFiiMovements, fiiSummary } from '@/features/fiis/fii.service'
const money=(v:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v)
const num=(v:string)=>Number(v.replace(',','.'))
const date=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export function FiisPage(){
 const qc=useQueryClient(),positions=useQuery({queryKey:['fiis','positions'],queryFn:listFiis}),movements=useQuery({queryKey:['fiis','movements'],queryFn:listFiiMovements})
 const {wallets}=useWallets();const usable=wallets.filter(w=>w.type!=='credit_card'&&!w.id.startsWith('group-'))
 const [ticker,setTicker]=useState(''),[name,setName]=useState(''),[quantity,setQuantity]=useState(''),[cost,setCost]=useState(''),[quote,setQuote]=useState(''),[openingDate,setOpeningDate]=useState(date)
 const [selected,setSelected]=useState(''),[kind,setKind]=useState<'buy'|'sell'|'dividend'>('buy'),[wallet,setWallet]=useState(''),[units,setUnits]=useState(''),[price,setPrice]=useState(''),[fees,setFees]=useState('0'),[paid,setPaid]=useState(''),[opDate,setOpDate]=useState(date),[err,setErr]=useState('')
 const [editId,setEditId]=useState(''),[editQuote,setEditQuote]=useState(''),[editName,setEditName]=useState('')
 const refresh=async()=>{await Promise.all([qc.invalidateQueries({queryKey:['fiis']}),qc.invalidateQueries({queryKey:['wallets']}),qc.invalidateQueries({queryKey:['dashboard']})])}
 const add=useMutation({mutationFn:createFii,onSuccess:refresh}),transaction=useMutation({mutationFn:createFiiMovement,onSuccess:refresh}),modify=useMutation({mutationFn:(x:{id:string;name:string|null;market_price:number|null})=>updateFii(x.id,x),onSuccess:refresh})
 async function submitNew(e:FormEvent){e.preventDefault();setErr('');try{
 const q=Number(quantity);const v=quote?num(quote):null;const c=cost?num(cost):null
 if(!Number.isInteger(q)||q<0||q>10000000|| (q>0&&!openingDate)|| (q===0&&c!==null))throw Error('Informe a quantidade e data inicial corretamente.')
 if(c!==null&&(!Number.isFinite(c)||c<0))throw Error('Custo inicial inválido.')
 if(v!==null&&(!Number.isFinite(v)||v<=0))throw Error('Cotação inválida.')
 await add.mutateAsync({ticker,name:name.trim()||null,opening_quantity:q,opening_date:q?openingDate:null,opening_cost:c,market_price:v});setTicker('');setName('');setQuantity('');setCost('');setQuote('')
 }catch(ex){setErr(ex instanceof Error?ex.message:'Não foi possível cadastrar o FII.')}}
 async function submitOperation(e:FormEvent){e.preventDefault();setErr('');try{
 if(!selected||!wallet)throw Error('Selecione o FII e a carteira.')
 const qty=kind==='dividend'?null:Number(units),unit=kind==='dividend'?null:num(price),fee=kind==='dividend'?0:num(fees)
 if(kind!=='dividend'&&(!Number.isInteger(qty)||qty!<=0||!Number.isFinite(unit)||unit!<=0))throw Error('Informe quantidade inteira e preço unitário válido.')
 if(!Number.isFinite(fee)||fee<0)throw Error('Taxas inválidas.')
 const amount=kind==='dividend'?num(paid):Math.round(((qty??0)*(unit??0)+(kind==='buy'?fee:-fee))*100)/100
 if(!Number.isFinite(amount)||amount<=0||Math.abs(amount*100-Math.round(amount*100))>.00001)throw Error('Valor total inválido.')
 if(kind==='sell'&&qty!>fiiSummary(positions.data!.find(p=>p.id===selected)!,movements.data??[]).quantity)throw Error('Você não possui todas essas cotas.')
 await transaction.mutateAsync({position_id:selected,wallet_id:wallet,kind,quantity:qty,unit_price:unit,fees:fee,amount,movement_date:opDate,notes:null})
 setUnits('');setPrice('');setFees('0');setPaid('')
 }catch(ex){setErr(ex instanceof Error?ex.message:'Não foi possível registrar a operação.')}}
 async function saveQuote(e:FormEvent){e.preventDefault();setErr('');try{const v=editQuote.trim()?num(editQuote):null;if(v!==null&&(!Number.isFinite(v)||v<=0))throw Error('Cotação inválida.');await modify.mutateAsync({id:editId,name:editName.trim()||null,market_price:v});setEditId('')}catch(ex){setErr(ex instanceof Error?ex.message:'Não foi possível atualizar.')}}
 const records=positions.data??[],ops=movements.data??[]
 return <AppLayout><div className="min-w-0 space-y-6">
 <header><h1 className="text-2xl font-semibold">Fundos Imobiliários</h1><p className="text-sm text-muted-foreground">Controle suas cotas, preços informados e proventos. Sem cotações automáticas.</p></header>
 {err&&<p role="alert" className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{err}</p>}
 {(positions.isError||movements.isError)&&<p role="alert" className="text-sm text-destructive">Falha ao consultar FIIs. Confira o acesso ao Supabase.</p>}
 <div className="grid gap-3 md:grid-cols-3">
  <Card><CardHeader><CardTitle className="text-sm">Valor de mercado informado</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{money(records.reduce((sum,p)=>sum+(fiiSummary(p,ops).marketValue??0),0))}</CardContent></Card>
  <Card><CardHeader><CardTitle className="text-sm">Total de cotas</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{records.reduce((sum,p)=>sum+fiiSummary(p,ops).quantity,0)}</CardContent></Card>
  <Card><CardHeader><CardTitle className="text-sm">Proventos registrados</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{money(ops.filter(x=>x.kind==='dividend').reduce((s,x)=>s+Number(x.amount),0))}</CardContent></Card>
 </div>
 <p className="text-xs text-muted-foreground">Valores de mercado dependem de cotação preenchida manualmente. Posições sem cotação não entram no total acima; o custo inicial pode ficar desconhecido.</p>
 <section className="grid gap-4 lg:grid-cols-2">
  <Card><CardHeader><CardTitle>Novo FII / posição inicial</CardTitle></CardHeader><CardContent><form onSubmit={submitNew} className="grid gap-3">
   <div className="grid gap-1"><Label>Ticker</Label><Input required placeholder="MXRF11" maxLength={12} value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())}/></div>
   <div className="grid gap-1"><Label>Nome (opcional)</Label><Input value={name} onChange={e=>setName(e.target.value)}/></div>
   <div className="grid grid-cols-2 gap-3"><div className="grid gap-1"><Label>Cotas que você já possui</Label><Input required inputMode="numeric" type="number" min={0} step={1} value={quantity} onChange={e=>setQuantity(e.target.value)}/></div><div className="grid gap-1"><Label>Data do saldo inicial</Label><Input type="date" value={openingDate} onChange={e=>setOpeningDate(e.target.value)}/></div></div>
   <div className="grid grid-cols-2 gap-3"><div className="grid gap-1"><Label>Custo total pago (opcional)</Label><Input inputMode="decimal" placeholder="Não informado" value={cost} onChange={e=>setCost(e.target.value)}/></div><div className="grid gap-1"><Label>Preço por cota atual (opcional)</Label><Input inputMode="decimal" placeholder="Ex.: 8,94" value={quote} onChange={e=>setQuote(e.target.value)}/></div></div>
   <p className="text-xs text-muted-foreground">Cotas anteriores não debitam a carteira. Não confunda cotação atual com preço de compra.</p><Button disabled={add.isPending}>{add.isPending?'Salvando…':'Cadastrar FII'}</Button>
  </form></CardContent></Card>
  <Card><CardHeader><CardTitle>Registrar operação</CardTitle></CardHeader><CardContent><form onSubmit={submitOperation} className="grid gap-3">
   <div className="grid gap-1"><Label>Fundo</Label><Select value={selected} onValueChange={setSelected}><SelectTrigger><SelectValue placeholder="Selecione o FII"/></SelectTrigger><SelectContent>{records.map(p=><SelectItem key={p.id} value={p.id}>{p.ticker}</SelectItem>)}</SelectContent></Select></div>
   <div className="grid grid-cols-2 gap-3"><div className="grid gap-1"><Label>Operação</Label><Select value={kind} onValueChange={v=>setKind(v as typeof kind)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="buy">Compra</SelectItem><SelectItem value="sell">Venda</SelectItem><SelectItem value="dividend">Provento</SelectItem></SelectContent></Select></div><div className="grid gap-1"><Label>Data</Label><Input type="date" value={opDate} onChange={e=>setOpDate(e.target.value)}/></div></div>
   {kind!=='dividend'?<div className="grid grid-cols-3 gap-2"><div className="grid gap-1"><Label>Cotas</Label><Input type="number" min={1} step={1} value={units} onChange={e=>setUnits(e.target.value)}/></div><div className="grid gap-1"><Label>Preço/cota</Label><Input inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)}/></div><div className="grid gap-1"><Label>Taxas (R$)</Label><Input inputMode="decimal" value={fees} onChange={e=>setFees(e.target.value)}/></div></div>:<div className="grid gap-1"><Label>Provento recebido (R$)</Label><Input inputMode="decimal" value={paid} onChange={e=>setPaid(e.target.value)}/></div>}
   <div className="grid gap-1"><Label>Carteira que pagou / recebeu</Label><Select value={wallet} onValueChange={setWallet}><SelectTrigger><SelectValue placeholder="Selecione a carteira"/></SelectTrigger><SelectContent>{usable.map(w=><SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
   <p className="text-xs text-muted-foreground">Compra diminui a carteira; venda e provento aumentam. Nenhuma operação de compra/venda é lançada como despesa ou receita comum.</p>
   <Button disabled={!records.length||!usable.length||transaction.isPending}>{transaction.isPending?'Registrando…':'Registrar operação'}</Button>
  </form></CardContent></Card>
 </section>
 <section className="space-y-3"><h2 className="text-lg font-semibold">Minha carteira de FIIs</h2>
  {positions.isLoading?<p className="text-sm text-muted-foreground">Carregando…</p>:!records.length?<p className="rounded-xl border p-6 text-sm text-muted-foreground">Nenhum FII cadastrado.</p>:<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{records.map(p=>{const v=fiiSummary(p,ops);return <Card key={p.id}><CardHeader><CardTitle className="break-words">{p.ticker}</CardTitle><p className="text-xs text-muted-foreground">{p.name||'Fundo imobiliário'}</p></CardHeader><CardContent className="space-y-2 text-sm">
   <div className="flex justify-between"><span>Cotas</span><strong>{v.quantity}</strong></div><div className="flex justify-between"><span>Valor de mercado</span><strong>{v.marketValue===null?'Não informado':money(v.marketValue)}</strong></div><div className="flex justify-between"><span>Preço médio</span><strong>{v.averageCost===null?'Desconhecido':money(v.averageCost)}</strong></div><div className="flex justify-between"><span>Valorização</span><strong>{v.unrealized===null?'—':money(v.unrealized)}</strong></div><div className="flex justify-between"><span>Proventos</span><strong>{money(v.dividends)}</strong></div>
   <Button type="button" variant="outline" onClick={()=>{setEditId(p.id);setEditName(p.name||'');setEditQuote(p.market_price===null?'':String(p.market_price).replace('.',','));setErr('')}}>Editar cotação / nome</Button>
  </CardContent></Card>})}</div>}
 </section>
 {editId&&<Card><CardHeader><CardTitle>Atualizar FII</CardTitle></CardHeader><CardContent><form onSubmit={saveQuote} className="grid gap-3 sm:grid-cols-2"><div className="grid gap-1"><Label>Nome</Label><Input value={editName} onChange={e=>setEditName(e.target.value)}/></div><div className="grid gap-1"><Label>Valor atual por cota (R$)</Label><Input inputMode="decimal" value={editQuote} onChange={e=>setEditQuote(e.target.value)}/></div><div className="flex gap-2 sm:col-span-2"><Button disabled={modify.isPending}>Salvar</Button><Button type="button" variant="outline" onClick={()=>setEditId('')}>Cancelar</Button></div></form></CardContent></Card>}
 <section className="space-y-3"><h2 className="text-lg font-semibold">Histórico de operações</h2><div className="overflow-hidden rounded-xl border bg-card">{ops.length?ops.map(m=><div key={m.id} className="flex justify-between gap-3 border-b px-3 py-3 text-sm last:border-0"><div className="min-w-0"><p className="font-semibold">{m.kind==='buy'?'Compra':m.kind==='sell'?'Venda':'Provento'} · {records.find(p=>p.id===m.position_id)?.ticker??'FII'}</p><p className="text-xs text-muted-foreground">{m.movement_date.split('-').reverse().join('/')} {m.quantity?('· '+m.quantity+' cotas'):''}</p></div><strong className="shrink-0">{m.kind==='buy'?'−':'+'}{money(Number(m.amount))}</strong></div>):<p className="p-5 text-sm text-muted-foreground">Sem operações futuras. A posição inicial não é uma compra nova.</p>}</div></section>
 </div></AppLayout>
}