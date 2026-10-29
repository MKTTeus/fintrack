-- Phase 1: transfers and credit card settlement are NOT income/expense.
-- This migration never changes or deletes existing records.
create table if not exists public.wallet_transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_wallet_id uuid not null references public.wallets(id) on delete restrict,
  destination_wallet_id uuid not null references public.wallets(id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  transfer_date date not null default current_date,
  notes text check (notes is null or char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  constraint wallet_transfers_distinct_wallets check (source_wallet_id <> destination_wallet_id)
);
create index if not exists wallet_transfers_user_date_idx on public.wallet_transfers(user_id, transfer_date desc);
create index if not exists wallet_transfers_source_idx on public.wallet_transfers(source_wallet_id);
create index if not exists wallet_transfers_destination_idx on public.wallet_transfers(destination_wallet_id);
alter table public.wallet_transfers enable row level security;
revoke all on public.wallet_transfers from public, anon, authenticated;
grant select, insert, delete on public.wallet_transfers to authenticated;
grant select, insert, update, delete on public.wallet_transfers to service_role;
create policy "transfers_own_select" on public.wallet_transfers for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "transfers_own_insert" on public.wallet_transfers for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.wallets w
      where w.id = source_wallet_id and w.user_id = (select auth.uid())
      and w.is_active and w.type <> 'credit_card'
    )
    and exists (
      select 1 from public.wallets w
      where w.id = destination_wallet_id and w.user_id = (select auth.uid())
      and w.is_active and w.type <> 'credit_card'
    )
  );
create policy "transfers_own_delete" on public.wallet_transfers for delete to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.credit_card_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credit_card_id uuid not null references public.credit_cards(id) on delete restrict,
  source_wallet_id uuid not null references public.wallets(id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  payment_date date not null default current_date,
  notes text check (notes is null or char_length(notes) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists credit_card_payments_card_date_idx on public.credit_card_payments(credit_card_id,payment_date desc);
create index if not exists credit_card_payments_user_date_idx on public.credit_card_payments(user_id,payment_date desc);
create index if not exists credit_card_payments_source_idx on public.credit_card_payments(source_wallet_id);
alter table public.credit_card_payments enable row level security;
revoke all on public.credit_card_payments from public,anon,authenticated;
grant select,insert,delete on public.credit_card_payments to authenticated;
grant select,insert,update,delete on public.credit_card_payments to service_role;
create policy "card_payments_own_select" on public.credit_card_payments for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "card_payments_own_insert" on public.credit_card_payments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.credit_cards c
      join public.wallets cw on cw.id = c.wallet_id
      where c.id = credit_card_id and c.user_id = (select auth.uid())
      and cw.user_id = (select auth.uid()) and cw.type = 'credit_card' and cw.is_active
    )
    and exists (
      select 1 from public.wallets w
      where w.id = source_wallet_id and w.user_id = (select auth.uid())
      and w.is_active and w.type <> 'credit_card'
    )
  );
create policy "card_payments_own_delete" on public.credit_card_payments for delete to authenticated
  using ((select auth.uid()) = user_id);
