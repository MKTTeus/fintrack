-- Register a credit wallet and its card as one atomic operation.
-- Invoker's RLS policies still protect both inserts.
create or replace function public.create_credit_wallet_with_card(
  p_name text,
  p_description text,
  p_bank_name text,
  p_card_name text,
  p_last_four_digits text default null,
  p_credit_limit numeric default null,
  p_closing_day integer default null,
  p_due_day integer default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_wallet_id uuid;
  v_card_id uuid;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if char_length(trim(coalesce(p_name,''))) not between 2 and 120
     or char_length(trim(coalesce(p_bank_name,''))) not between 2 and 120
     or char_length(trim(coalesce(p_card_name,''))) not between 2 and 120
     or (p_credit_limit is not null and p_credit_limit < 0)
     or (p_closing_day is not null and p_closing_day not between 1 and 31)
     or (p_due_day is not null and p_due_day not between 1 and 31)
     or (p_last_four_digits is not null and
       (char_length(p_last_four_digits) <> 4 or p_last_four_digits !~ '^[0-9]{4}$'))
  then
    raise exception 'Invalid credit card data' using errcode = '22023';
  end if;

  insert into public.wallets (user_id, name, type, description, current_balance, is_active)
  values (v_user, trim(p_name), 'credit_card', p_description, 0, true)
  returning id into v_wallet_id;

  insert into public.credit_cards (
    user_id, wallet_id, bank_name, card_name, last_four_digits,
    credit_limit, closing_day, due_day, is_active
  ) values (
    v_user, v_wallet_id, trim(p_bank_name), trim(p_card_name),
    p_last_four_digits, p_credit_limit, p_closing_day, p_due_day, true
  ) returning id into v_card_id;

  return jsonb_build_object('wallet_id',v_wallet_id,'card_id',v_card_id);
end;
$$;
revoke all on function public.create_credit_wallet_with_card(text,text,text,text,text,numeric,integer,integer)
 from public,anon,authenticated;
grant execute on function public.create_credit_wallet_with_card(text,text,text,text,text,numeric,integer,integer)
 to authenticated;
