import { supabase } from '@/lib/supabase'
export type FiiPosition = { id: string; ticker: string; name: string | null; opening_quantity: number; opening_cost: number | null; opening_date: string | null; market_price: number | null; price_updated_at: string | null; notes: string | null }
export type FiiMovement = { id: string; position_id: string; wallet_id: string; kind: 'buy'|'sell'|'dividend'; quantity: number | null; unit_price: number | null; fees: number; amount: number; movement_date: string; notes: string | null; created_at: string }
async function owner() { const {data:{user},error}=await supabase.auth.getUser(); if(error||!user) throw new Error('Entre novamente no FinTrack.'); return user.id }
export async function listFiis(): Promise<FiiPosition[]> {const user=await owner();const {data,error}=await supabase.from('fii_positions').select('*').eq('user_id',user).order('ticker');if(error)throw error;return data??[]}
export async function listFiiMovements(): Promise<FiiMovement[]> {const user=await owner();const {data,error}=await supabase.from('fii_movements').select('*').eq('user_id',user).order('movement_date',{ascending:false}).limit(1000);if(error)throw error;return data??[]}
export async function createFii(input:{ticker:string;name?:string|null;opening_quantity:number;opening_cost?:number|null;opening_date?:string|null;market_price?:number|null}){
 const user=await owner();const ticker=input.ticker.trim().toUpperCase();if(!/^[A-Z0-9]{4,12}$/.test(ticker))throw new Error('Ticker inválido.');
 const {data,error}=await supabase.from('fii_positions').insert({...input,ticker,user_id:user,price_updated_at:input.market_price?new Date().toISOString():null}).select('*').single();if(error)throw error;return data
}
export async function updateFii(id:string,input:{name?:string|null;market_price?:number|null;notes?:string|null}){
 const user=await owner();const {data,error}=await supabase.from('fii_positions').update({...input,price_updated_at:input.market_price?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',user).select('*').single();if(error)throw error;return data
}
export async function createFiiMovement(input:{position_id:string;wallet_id:string;kind:'buy'|'sell'|'dividend';quantity:number|null;unit_price:number|null;fees:number;amount:number;movement_date:string;notes:string|null}){
 const user=await owner();const {data,error}=await supabase.from('fii_movements').insert({...input,user_id:user}).select('*').single();if(error)throw error;return data
}
export function fiiSummary(p:FiiPosition, movements:FiiMovement[]){
 let qty=Number(p.opening_quantity),cost=p.opening_cost===null?null:Number(p.opening_cost),dividends=0,realized=0
 const events=movements.filter(m=>m.position_id===p.id).sort((a,b)=>a.movement_date.localeCompare(b.movement_date)||a.created_at.localeCompare(b.created_at))
 for(const m of events){const n=Number(m.quantity??0),amount=Number(m.amount);if(m.kind==='dividend'){dividends+=amount;continue}
  if(m.kind==='buy'){if(cost!==null)cost+=amount;qty+=n}
  if(m.kind==='sell'&&n<=qty){const basis=cost!==null&&qty>0?cost*n/qty:null;if(basis!==null){realized+=amount-basis;cost-=basis}qty-=n}}
 const value=p.market_price===null?null:qty*Number(p.market_price)
 return {quantity:qty,cost,averageCost:cost===null||qty===0?null:cost/qty,marketValue:value,unrealized:value===null||cost===null?null:value-cost,dividends,realized}
}