create or replace function public.open_negotiation(
  target_auction_id uuid,
  target_buyer_id uuid,
  offer_amount integer,
  offer_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
  auction_record public.auctions%rowtype;
  v_negotiation_id uuid;
begin
  if current_user_id is null or not private.has_role(current_user_id, 'admin') then
    raise exception 'Sem permissões para abrir negociações.';
  end if;

  if offer_amount is null or offer_amount <= 0 then
    raise exception 'Valor de proposta inválido.';
  end if;

  select *
  into auction_record
  from public.auctions
  where id = target_auction_id;

  if not found then
    raise exception 'Leilão não encontrado.';
  end if;

  if not exists (
    select 1
    from public.profiles p
    join public.user_roles ur on ur.user_id = p.id
    where p.id = target_buyer_id
      and p.status = 'approved'
      and ur.role = 'buyer'
  ) then
    raise exception 'Comprador inválido ou ainda não aprovado.';
  end if;

  if not exists (
    select 1
    from public.bids
    where auction_id = target_auction_id
      and bidder_id = target_buyer_id
  ) then
    raise exception 'Só pode abrir negociação com um comprador que licitou neste leilão.';
  end if;

  insert into public.negotiations (
    auction_id,
    buyer_id,
    status,
    expires_at
  )
  values (
    target_auction_id,
    target_buyer_id,
    'open',
    now() + interval '72 hours'
  )
  on conflict (auction_id, buyer_id) do update
  set
    status = 'open',
    expires_at = greatest(public.negotiations.expires_at, now() + interval '72 hours'),
    updated_at = now()
  returning id into v_negotiation_id;

  insert into public.negotiation_rounds (
    negotiation_id,
    round_number,
    initiated_by,
    amount,
    message,
    created_by
  )
  select
    v_negotiation_id,
    coalesce(max(round_number), 0) + 1,
    'admin',
    offer_amount,
    nullif(trim(offer_message), ''),
    current_user_id
  from public.negotiation_rounds
  where public.negotiation_rounds.negotiation_id = v_negotiation_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    target_buyer_id,
    'negotiation_started',
    'Negociação iniciada',
    'A ReDrive abriu uma negociação privada para um leilão.',
    jsonb_build_object('auction_id', target_auction_id, 'negotiation_id', v_negotiation_id)
  );

  return v_negotiation_id;
end;
$$;

create or replace function public.submit_negotiation_round(
  target_negotiation_id uuid,
  offer_amount integer,
  offer_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
  negotiation_record public.negotiations%rowtype;
  actor public.negotiation_actor;
  last_actor public.negotiation_actor;
  next_round_number integer;
  new_round_id uuid;
begin
  if current_user_id is null then
    raise exception 'É necessário iniciar sessão.';
  end if;

  if offer_amount is null or offer_amount <= 0 then
    raise exception 'Valor de proposta inválido.';
  end if;

  select *
  into negotiation_record
  from public.negotiations
  where id = target_negotiation_id
  for update;

  if not found then
    raise exception 'Negociação não encontrada.';
  end if;

  if negotiation_record.status <> 'open' then
    raise exception 'Esta negociação já não está aberta.';
  end if;

  if negotiation_record.expires_at <= now() then
    update public.negotiations
    set status = 'expired', updated_at = now()
    where id = target_negotiation_id;

    raise exception 'Esta negociação expirou.';
  end if;

  if private.has_role(current_user_id, 'admin') then
    actor := 'admin';
  elsif negotiation_record.buyer_id = current_user_id then
    actor := 'buyer';
  else
    raise exception 'Sem permissões para responder a esta negociação.';
  end if;

  select initiated_by, round_number
  into last_actor, next_round_number
  from public.negotiation_rounds
  where negotiation_id = target_negotiation_id
  order by round_number desc
  limit 1;

  if last_actor = actor then
    raise exception 'Aguarde a resposta da outra parte.';
  end if;

  next_round_number := coalesce(next_round_number, 0) + 1;

  if next_round_number > negotiation_record.max_rounds then
    raise exception 'Limite de rondas atingido.';
  end if;

  insert into public.negotiation_rounds (
    negotiation_id,
    round_number,
    initiated_by,
    amount,
    message,
    created_by
  )
  values (
    target_negotiation_id,
    next_round_number,
    actor,
    offer_amount,
    nullif(trim(offer_message), ''),
    current_user_id
  )
  returning id into new_round_id;

  update public.negotiations
  set updated_at = now()
  where id = target_negotiation_id;

  insert into public.notifications (user_id, type, title, body, data)
  select
    recipient_id,
    'negotiation_received',
    'Nova proposta recebida',
    'Existe uma nova proposta numa negociação privada.',
    jsonb_build_object('negotiation_id', target_negotiation_id)
  from (
    select negotiation_record.buyer_id as recipient_id
    where actor = 'admin'
    union
    select ur.user_id as recipient_id
    from public.user_roles ur
    where actor = 'buyer'
      and ur.role = 'admin'
  ) recipients;

  return new_round_id;
end;
$$;

create or replace function public.accept_negotiation_offer(target_negotiation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
  negotiation_record public.negotiations%rowtype;
  auction_record public.auctions%rowtype;
  actor public.negotiation_actor;
  last_round public.negotiation_rounds%rowtype;
  order_id uuid;
begin
  if current_user_id is null then
    raise exception 'É necessário iniciar sessão.';
  end if;

  select *
  into negotiation_record
  from public.negotiations
  where id = target_negotiation_id
  for update;

  if not found then
    raise exception 'Negociação não encontrada.';
  end if;

  if negotiation_record.status <> 'open' then
    raise exception 'Esta negociação já não está aberta.';
  end if;

  if private.has_role(current_user_id, 'admin') then
    actor := 'admin';
  elsif negotiation_record.buyer_id = current_user_id then
    actor := 'buyer';
  else
    raise exception 'Sem permissões para aceitar esta negociação.';
  end if;

  select *
  into last_round
  from public.negotiation_rounds
  where negotiation_id = target_negotiation_id
  order by round_number desc
  limit 1;

  if not found then
    raise exception 'Esta negociação ainda não tem propostas.';
  end if;

  if last_round.initiated_by = actor then
    raise exception 'Só pode aceitar uma proposta da outra parte.';
  end if;

  select *
  into auction_record
  from public.auctions
  where id = negotiation_record.auction_id
  for update;

  if not found then
    raise exception 'Leilão não encontrado.';
  end if;

  update public.negotiations
  set
    status = 'accepted',
    accepted_amount = last_round.amount,
    updated_at = now()
  where id = target_negotiation_id;

  update public.auctions
  set
    status = 'ended',
    winner_id = negotiation_record.buyer_id,
    current_price = greatest(current_price, last_round.amount),
    updated_at = now()
  where id = negotiation_record.auction_id;

  insert into public.orders (
    auction_id,
    buyer_id,
    vehicle_id,
    amount,
    status,
    delivery_status
  )
  values (
    negotiation_record.auction_id,
    negotiation_record.buyer_id,
    auction_record.vehicle_id,
    last_round.amount,
    'pending_payment',
    'pending'
  )
  on conflict (auction_id) do update
  set
    buyer_id = excluded.buyer_id,
    vehicle_id = excluded.vehicle_id,
    amount = excluded.amount,
    status = 'pending_payment',
    delivery_status = 'pending',
    updated_at = now()
  returning id into order_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    negotiation_record.buyer_id,
    'negotiation_accepted',
    'Negociação aceite',
    'A negociação foi aceite e a encomenda foi criada.',
    jsonb_build_object(
      'auction_id', negotiation_record.auction_id,
      'negotiation_id', target_negotiation_id,
      'order_id', order_id
    )
  );

  return order_id;
end;
$$;

revoke execute on function public.open_negotiation(uuid, uuid, integer, text) from public, anon;
revoke execute on function public.submit_negotiation_round(uuid, integer, text) from public, anon;
revoke execute on function public.accept_negotiation_offer(uuid) from public, anon;

grant execute on function public.open_negotiation(uuid, uuid, integer, text) to authenticated;
grant execute on function public.submit_negotiation_round(uuid, integer, text) to authenticated;
grant execute on function public.accept_negotiation_offer(uuid) to authenticated;
