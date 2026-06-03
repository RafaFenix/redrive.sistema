create extension if not exists pg_cron with schema extensions;

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
  extended_ends_at timestamptz;
  buy_now_order_id uuid;
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

  extended_ends_at := case
    when normalized_is_buy_now then now()
    when auction_record.ends_at <= now() + interval '2 minutes' then now() + interval '2 minutes'
    else auction_record.ends_at
  end;

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
    ends_at = extended_ends_at,
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
    update public.vehicles
    set
      status = 'sold',
      updated_at = now()
    where id = auction_record.vehicle_id;

    insert into public.orders (
      auction_id,
      buyer_id,
      vehicle_id,
      winning_bid_id,
      amount,
      status,
      delivery_status
    )
    values (
      target_auction_id,
      current_user_id,
      auction_record.vehicle_id,
      new_bid_id,
      bid_amount,
      'pending_payment',
      'pending'
    )
    on conflict (auction_id) do update
    set
      buyer_id = excluded.buyer_id,
      vehicle_id = excluded.vehicle_id,
      winning_bid_id = excluded.winning_bid_id,
      amount = excluded.amount,
      status = 'pending_payment',
      delivery_status = 'pending',
      updated_at = now()
    returning id into buy_now_order_id;

    insert into public.notifications (user_id, type, title, body, data)
    values (
      current_user_id,
      'order_created',
      'Compra imediata confirmada',
      'A adjudicação foi criada e já pode acompanhar a entrega.',
      jsonb_build_object(
        'auction_id', target_auction_id,
        'order_id', buy_now_order_id,
        'bid_id', new_bid_id
      )
    );
  end if;

  return new_bid_id;
end;
$$;

revoke execute on function public.place_bid(uuid, integer, boolean) from public, anon;
grant execute on function public.place_bid(uuid, integer, boolean) to authenticated;

create or replace function public.activate_due_auctions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_count integer := 0;
begin
  update public.auctions
  set
    status = 'active',
    updated_at = now()
  where status = 'scheduled'
    and starts_at <= now()
    and ends_at > now();

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

create or replace function public.close_due_auctions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  auction_record public.auctions%rowtype;
  top_bid public.bids%rowtype;
  closed_count integer := 0;
  order_id uuid;
  new_negotiation_id uuid;
begin
  for auction_record in
    select *
    from public.auctions
    where status = 'active'
      and ends_at <= now()
    order by ends_at asc
    for update skip locked
  loop
    select *
    into top_bid
    from public.bids
    where auction_id = auction_record.id
      and status <> 'cancelled'
    order by amount desc, created_at asc
    limit 1;

    if not found then
      update public.auctions
      set
        status = 'ended',
        winner_id = null,
        updated_at = now()
      where id = auction_record.id;

      closed_count := closed_count + 1;
      continue;
    end if;

    if top_bid.amount >= auction_record.reserve_price then
      update public.bids
      set status = case when id = top_bid.id then 'won'::public.bid_status else 'outbid'::public.bid_status end
      where auction_id = auction_record.id
        and status <> 'cancelled';

      update public.auctions
      set
        status = 'ended',
        winner_id = top_bid.bidder_id,
        current_price = greatest(current_price, top_bid.amount),
        updated_at = now()
      where id = auction_record.id;

      update public.vehicles
      set
        status = 'sold',
        updated_at = now()
      where id = auction_record.vehicle_id;

      insert into public.orders (
        auction_id,
        buyer_id,
        vehicle_id,
        winning_bid_id,
        amount,
        status,
        delivery_status
      )
      values (
        auction_record.id,
        top_bid.bidder_id,
        auction_record.vehicle_id,
        top_bid.id,
        top_bid.amount,
        'pending_payment',
        'pending'
      )
      on conflict (auction_id) do update
      set
        buyer_id = excluded.buyer_id,
        vehicle_id = excluded.vehicle_id,
        winning_bid_id = excluded.winning_bid_id,
        amount = excluded.amount,
        status = 'pending_payment',
        delivery_status = 'pending',
        updated_at = now()
      returning id into order_id;

      insert into public.notifications (user_id, type, title, body, data)
      select
        top_bid.bidder_id,
        'order_created'::public.notification_type,
        'Leilão ganho',
        'A adjudicação foi criada e já pode acompanhar a entrega.',
        jsonb_build_object('auction_id', auction_record.id, 'order_id', order_id, 'bid_id', top_bid.id)
      where not exists (
        select 1
        from public.notifications n
        where n.user_id = top_bid.bidder_id
          and n.type = 'order_created'
          and n.data->>'order_id' = order_id::text
      );

      insert into public.notifications (user_id, type, title, body, data)
      select distinct
        b.bidder_id,
        'auction_lost'::public.notification_type,
        'Leilão encerrado',
        'O leilão terminou e outro comprador venceu.',
        jsonb_build_object('auction_id', auction_record.id)
      from public.bids b
      where b.auction_id = auction_record.id
        and b.bidder_id <> top_bid.bidder_id
        and not exists (
          select 1
          from public.notifications n
          where n.user_id = b.bidder_id
            and n.type = 'auction_lost'
            and n.data->>'auction_id' = auction_record.id::text
        );
    else
      update public.bids
      set status = case when id = top_bid.id then 'active'::public.bid_status else 'outbid'::public.bid_status end
      where auction_id = auction_record.id
        and status <> 'cancelled';

      update public.auctions
      set
        status = 'ended',
        winner_id = null,
        current_price = greatest(current_price, top_bid.amount),
        updated_at = now()
      where id = auction_record.id;

      insert into public.negotiations (
        auction_id,
        buyer_id,
        status,
        expires_at
      )
      values (
        auction_record.id,
        top_bid.bidder_id,
        'open',
        now() + interval '72 hours'
      )
      on conflict (auction_id, buyer_id) do update
      set
        status = 'open',
        expires_at = greatest(public.negotiations.expires_at, now() + interval '72 hours'),
        updated_at = now()
      returning id into new_negotiation_id;

      insert into public.negotiation_rounds (
        negotiation_id,
        round_number,
        initiated_by,
        amount,
        message,
        created_by
      )
      select
        new_negotiation_id,
        1,
        'admin'::public.negotiation_actor,
        auction_record.reserve_price,
        'Proposta automática após o encerramento do leilão abaixo da reserva.',
        null
      where not exists (
        select 1
        from public.negotiation_rounds nr
        where nr.negotiation_id = new_negotiation_id
      );

      insert into public.notifications (user_id, type, title, body, data)
      select
        top_bid.bidder_id,
        'negotiation_started'::public.notification_type,
        'Negociação iniciada',
        'A reserva não foi atingida. Abrimos uma negociação privada consigo.',
        jsonb_build_object('auction_id', auction_record.id, 'negotiation_id', new_negotiation_id)
      where not exists (
        select 1
        from public.notifications n
        where n.user_id = top_bid.bidder_id
          and n.type = 'negotiation_started'
          and n.data->>'negotiation_id' = new_negotiation_id::text
      );
    end if;

    closed_count := closed_count + 1;
  end loop;

  return closed_count;
end;
$$;

create or replace function public.expire_due_negotiations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_count integer := 0;
begin
  update public.negotiations
  set
    status = 'expired',
    updated_at = now()
  where status = 'open'
    and expires_at <= now();

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

create or replace function public.notify_watchlist_ending()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_count integer := 0;
begin
  insert into public.notifications (user_id, type, title, body, data)
  select
    w.user_id,
    'auction_ending'::public.notification_type,
    'Leilão termina em breve',
    'Um leilão da sua watchlist termina dentro de aproximadamente 1 hora.',
    jsonb_build_object('auction_id', a.id)
  from public.watchlist w
  join public.auctions a on a.id = w.auction_id
  where a.status = 'active'
    and a.ends_at > now()
    and a.ends_at <= now() + interval '1 hour'
    and not exists (
      select 1
      from public.notifications n
      where n.user_id = w.user_id
        and n.type = 'auction_ending'
        and n.data->>'auction_id' = a.id::text
    );

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

create or replace function public.run_auction_lifecycle_jobs()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  activated_count integer;
  watchlist_count integer;
  closed_count integer;
  expired_count integer;
begin
  activated_count := public.activate_due_auctions();
  watchlist_count := public.notify_watchlist_ending();
  closed_count := public.close_due_auctions();
  expired_count := public.expire_due_negotiations();

  return jsonb_build_object(
    'activated_auctions', activated_count,
    'watchlist_notifications', watchlist_count,
    'closed_auctions', closed_count,
    'expired_negotiations', expired_count,
    'ran_at', now()
  );
end;
$$;

revoke execute on function public.activate_due_auctions() from public, anon, authenticated;
revoke execute on function public.close_due_auctions() from public, anon, authenticated;
revoke execute on function public.expire_due_negotiations() from public, anon, authenticated;
revoke execute on function public.notify_watchlist_ending() from public, anon, authenticated;
revoke execute on function public.run_auction_lifecycle_jobs() from public, anon, authenticated;

do $$
begin
  if exists (
    select 1
    from pg_namespace
    where nspname = 'cron'
  ) then
    if exists (
      select 1
      from cron.job
      where jobname = 'redrive-auction-lifecycle'
    ) then
      perform cron.unschedule('redrive-auction-lifecycle');
    end if;

    perform cron.schedule(
      'redrive-auction-lifecycle',
      '* * * * *',
      'select public.run_auction_lifecycle_jobs();'
    );
  end if;
exception
  when others then
    raise notice 'Could not schedule pg_cron job redrive-auction-lifecycle: %', sqlerrm;
end $$;
