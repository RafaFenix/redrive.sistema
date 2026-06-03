create or replace function public.place_bid(
  target_auction_id uuid,
  bid_amount integer,
  is_buy_now boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
  auction_record public.auctions%rowtype;
  new_bid_id uuid;
  normalized_is_buy_now boolean := coalesce(is_buy_now, false);
  outbid_user_ids uuid[];
begin
  if current_user_id is null then
    raise exception 'É necessário iniciar sessão para licitar.';
  end if;

  if not private.is_approved_buyer(current_user_id) then
    raise exception 'Apenas compradores aprovados podem licitar.';
  end if;

  if bid_amount is null or bid_amount <= 0 then
    raise exception 'Valor de lance inválido.';
  end if;

  select *
  into auction_record
  from public.auctions
  where id = target_auction_id
  for update;

  if not found then
    raise exception 'Leilão não encontrado.';
  end if;

  if auction_record.status <> 'active' then
    raise exception 'Este leilão não está ativo.';
  end if;

  if now() < auction_record.starts_at or now() > auction_record.ends_at then
    raise exception 'Este leilão está fora do período de licitação.';
  end if;

  if normalized_is_buy_now then
    if auction_record.buy_now_price is null then
      raise exception 'Comprar Já não está disponível para este leilão.';
    end if;

    if bid_amount < auction_record.buy_now_price then
      raise exception 'O valor Comprar Já deve ser igual ou superior ao preço definido.';
    end if;

    bid_amount := auction_record.buy_now_price;
  elsif bid_amount <= auction_record.current_price then
    raise exception 'O lance deve ser superior ao lance atual.';
  end if;

  with updated_bids as (
    update public.bids
    set status = 'outbid'
    where auction_id = target_auction_id
      and status = 'active'
    returning bidder_id
  )
  select coalesce(array_agg(distinct bidder_id), '{}')
  into outbid_user_ids
  from updated_bids
  where bidder_id <> current_user_id;

  insert into public.bids (
    auction_id,
    bidder_id,
    amount,
    status,
    is_buy_now
  )
  values (
    target_auction_id,
    current_user_id,
    bid_amount,
    case when normalized_is_buy_now then 'won'::public.bid_status else 'active'::public.bid_status end,
    normalized_is_buy_now
  )
  returning id into new_bid_id;

  update public.auctions
  set
    current_price = bid_amount,
    bid_count = bid_count + 1,
    winner_id = case when normalized_is_buy_now then current_user_id else winner_id end,
    status = case when normalized_is_buy_now then 'ended'::public.auction_status else status end,
    ends_at = case when normalized_is_buy_now then now() else ends_at end,
    updated_at = now()
  where id = target_auction_id;

  insert into public.notifications (user_id, type, title, body, data)
  select
    outbid_user_id,
    'bid_outbid',
    'Lance superado',
    'O seu lance foi superado por outro comprador.',
    jsonb_build_object('auction_id', target_auction_id)
  from unnest(outbid_user_ids) as outbid_user_id;

  if normalized_is_buy_now then
    insert into public.notifications (user_id, type, title, body, data)
    values (
      current_user_id,
      'auction_won',
      'Leilão ganho',
      'A compra imediata foi confirmada.',
      jsonb_build_object('auction_id', target_auction_id, 'bid_id', new_bid_id)
    );
  end if;

  return new_bid_id;
end;
$$;

revoke execute on function public.place_bid(uuid, integer, boolean) from public, anon;
grant execute on function public.place_bid(uuid, integer, boolean) to authenticated;
