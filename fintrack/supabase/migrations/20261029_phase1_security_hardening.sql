-- Harden pre-existing helper functions and speed up user-scoped transaction reads.
-- No financial rows are modified.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
alter function public.update_updated_at_column() set search_path = 'pg_catalog';
create index if not exists transactions_user_date_idx
  on public.transactions(user_id,transaction_date desc);
