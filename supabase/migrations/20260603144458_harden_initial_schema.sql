create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function private.is_approved_buyer(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.user_roles ur on ur.user_id = p.id
    where p.id = _user_id
      and p.status = 'approved'
      and ur.role = 'buyer'
  );
$$;

create or replace function private.vehicle_has_damage_report(_vehicle_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vehicles
    where id = _vehicle_id
      and damage_report_path is not null
  );
$$;

create or replace function private.vehicle_has_appraisal(_vehicle_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vehicles
    where id = _vehicle_id
      and appraisal_path is not null
  );
$$;

create or replace function private.vehicle_has_service_history(_vehicle_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vehicles
    where id = _vehicle_id
      and service_history_path is not null
  );
$$;

create or replace function private.auction_reserve_met(_auction_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.auctions
    where id = _auction_id
      and current_price >= reserve_price
  );
$$;

grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;
grant execute on function private.is_approved_buyer(uuid) to authenticated, service_role;
grant execute on function private.vehicle_has_damage_report(uuid) to anon, authenticated, service_role;
grant execute on function private.vehicle_has_appraisal(uuid) to anon, authenticated, service_role;
grant execute on function private.vehicle_has_service_history(uuid) to anon, authenticated, service_role;
grant execute on function private.auction_reserve_met(uuid) to anon, authenticated, service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    company_name,
    vat_number,
    contact_name,
    contact_phone,
    city,
    country
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'company_name', ''),
    coalesce(new.raw_user_meta_data ->> 'vat_number', ''),
    coalesce(new.raw_user_meta_data ->> 'contact_name', ''),
    coalesce(new.raw_user_meta_data ->> 'contact_phone', ''),
    coalesce(new.raw_user_meta_data ->> 'city', ''),
    coalesce(new.raw_user_meta_data ->> 'country', 'PT')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'buyer')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

drop function if exists public.handle_new_user();

create policy "vehicles_public_select_active"
on public.vehicles for select
to anon, authenticated
using (status in ('active', 'sold'));

create policy "auctions_public_select_visible"
on public.auctions for select
to anon, authenticated
using (
  status in ('scheduled', 'active', 'ended')
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_id
      and v.status in ('active', 'sold')
  )
);

grant select (
  id,
  status,
  make,
  model,
  variant,
  year,
  mileage,
  color,
  fuel_type,
  transmission,
  power_cv,
  doors,
  condition,
  description,
  photos,
  additional_services,
  legalization_cost,
  market_price_ref,
  lead_time_days,
  created_at,
  updated_at
) on public.vehicles to anon, authenticated;

grant select (
  id,
  lot_number,
  vehicle_id,
  status,
  mode,
  starting_price,
  buy_now_price,
  current_price,
  bid_increments,
  starts_at,
  ends_at,
  bid_count,
  viewer_count,
  created_at,
  updated_at
) on public.auctions to anon, authenticated;

create or replace view public.public_vehicles
with (security_invoker = true)
as
select
  id,
  status,
  make,
  model,
  variant,
  year,
  mileage,
  color,
  fuel_type,
  transmission,
  power_cv,
  doors,
  condition,
  description,
  photos,
  private.vehicle_has_damage_report(id) as has_damage_report,
  private.vehicle_has_appraisal(id) as has_appraisal,
  private.vehicle_has_service_history(id) as has_service_history,
  additional_services,
  legalization_cost,
  market_price_ref,
  lead_time_days,
  created_at,
  updated_at
from public.vehicles
where status in ('active', 'sold');

create or replace view public.public_auctions
with (security_invoker = true)
as
select
  a.id,
  a.lot_number,
  a.vehicle_id,
  a.status,
  a.mode,
  a.starting_price,
  a.buy_now_price,
  a.current_price,
  a.bid_increments,
  a.starts_at,
  a.ends_at,
  a.bid_count,
  a.viewer_count,
  private.auction_reserve_met(a.id) as reserve_met,
  a.created_at,
  a.updated_at
from public.auctions a
join public.vehicles v on v.id = a.vehicle_id
where a.status in ('scheduled', 'active', 'ended')
  and v.status in ('active', 'sold');

grant select on public.public_vehicles, public.public_auctions to anon, authenticated;

alter policy "profiles_select_own_or_admin"
on public.profiles
using (id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "profiles_insert_own"
on public.profiles
with check (id = (select auth.uid()));

alter policy "profiles_update_own_or_admin"
on public.profiles
using (id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'))
with check (id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "user_roles_select_own_or_admin"
on public.user_roles
using (user_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "user_roles_admin_all"
on public.user_roles
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "vehicles_admin_all"
on public.vehicles
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "auctions_admin_all"
on public.auctions
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "bids_select_approved_buyers_or_admin"
on public.bids
using (
  private.is_approved_buyer((select auth.uid()))
  or private.has_role((select auth.uid()), 'admin')
);

alter policy "bids_insert_approved_buyer"
on public.bids
with check (
  bidder_id = (select auth.uid())
  and private.is_approved_buyer((select auth.uid()))
  and exists (
    select 1
    from public.auctions a
    where a.id = auction_id
      and a.status = 'active'
      and now() between a.starts_at and a.ends_at
  )
);

alter policy "bids_admin_update"
on public.bids
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "orders_select_own_or_admin"
on public.orders
using (buyer_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "orders_admin_all"
on public.orders
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "negotiations_select_own_or_admin"
on public.negotiations
using (buyer_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "negotiations_admin_all"
on public.negotiations
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "negotiation_rounds_select_participants"
on public.negotiation_rounds
using (
  private.has_role((select auth.uid()), 'admin')
  or exists (
    select 1
    from public.negotiations n
    where n.id = negotiation_id
      and n.buyer_id = (select auth.uid())
  )
);

alter policy "negotiation_rounds_insert_participants"
on public.negotiation_rounds
with check (
  private.has_role((select auth.uid()), 'admin')
  or exists (
    select 1
    from public.negotiations n
    where n.id = negotiation_id
      and n.buyer_id = (select auth.uid())
      and n.status = 'open'
  )
);

alter policy "notifications_select_own_or_admin"
on public.notifications
using (user_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "notifications_update_own_read_state"
on public.notifications
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

alter policy "notifications_admin_all"
on public.notifications
using (private.has_role((select auth.uid()), 'admin'))
with check (private.has_role((select auth.uid()), 'admin'));

alter policy "watchlist_select_own_or_admin"
on public.watchlist
using (user_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "watchlist_insert_own_approved_buyer"
on public.watchlist
with check (
  user_id = (select auth.uid())
  and private.is_approved_buyer((select auth.uid()))
);

alter policy "watchlist_delete_own"
on public.watchlist
using (user_id = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'));

alter policy "vehicle_photos_admin_write"
on storage.objects
using (bucket_id = 'vehicle-photos' and private.has_role((select auth.uid()), 'admin'))
with check (bucket_id = 'vehicle-photos' and private.has_role((select auth.uid()), 'admin'));

alter policy "vehicle_documents_admin_all"
on storage.objects
using (bucket_id = 'vehicle-documents' and private.has_role((select auth.uid()), 'admin'))
with check (bucket_id = 'vehicle-documents' and private.has_role((select auth.uid()), 'admin'));

alter policy "trade_registry_owner_insert"
on storage.objects
with check (
  bucket_id = 'trade-registry'
  and owner = (select auth.uid())
  and name like (select auth.uid())::text || '/%'
);

alter policy "trade_registry_owner_select"
on storage.objects
using (
  bucket_id = 'trade-registry'
  and (owner = (select auth.uid()) or private.has_role((select auth.uid()), 'admin'))
);

alter policy "trade_registry_admin_all"
on storage.objects
using (bucket_id = 'trade-registry' and private.has_role((select auth.uid()), 'admin'))
with check (bucket_id = 'trade-registry' and private.has_role((select auth.uid()), 'admin'));

drop policy if exists "vehicle_photos_public_select" on storage.objects;

drop function if exists public.has_role(uuid, public.app_role);
drop function if exists public.is_approved_buyer(uuid);

create index if not exists profiles_approved_by_idx on public.profiles(approved_by);
create index if not exists vehicles_created_by_idx on public.vehicles(created_by);
create index if not exists auctions_created_by_idx on public.auctions(created_by);
create index if not exists auctions_winner_id_idx on public.auctions(winner_id);
create index if not exists orders_vehicle_id_idx on public.orders(vehicle_id);
create index if not exists orders_winning_bid_id_idx on public.orders(winning_bid_id);
create index if not exists negotiation_rounds_created_by_idx on public.negotiation_rounds(created_by);
create index if not exists watchlist_auction_id_idx on public.watchlist(auction_id);
