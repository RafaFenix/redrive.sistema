create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('admin', 'buyer');
create type public.user_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.vehicle_status as enum ('draft', 'active', 'sold', 'archived');
create type public.auction_status as enum ('scheduled', 'active', 'ended', 'cancelled');
create type public.auction_mode as enum ('standard', 'blind');
create type public.bid_status as enum ('active', 'outbid', 'won', 'cancelled');
create type public.negotiation_status as enum ('open', 'accepted', 'rejected', 'expired');
create type public.negotiation_actor as enum ('admin', 'buyer');
create type public.order_status as enum ('pending_payment', 'paid', 'cancelled', 'completed');
create type public.delivery_status as enum (
  'pending',
  'awaiting_payment',
  'documentation',
  'in_transit',
  'ready_for_pickup',
  'delivered',
  'cancelled'
);
create type public.notification_type as enum (
  'account_approved',
  'account_rejected',
  'bid_placed',
  'bid_outbid',
  'auction_won',
  'auction_lost',
  'auction_ending',
  'watchlist_starting',
  'negotiation_started',
  'negotiation_received',
  'negotiation_accepted',
  'negotiation_rejected',
  'order_created'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  status public.user_status not null default 'pending',
  company_name text not null default '',
  vat_number text not null default '',
  contact_name text not null default '',
  contact_phone text not null default '',
  address text,
  city text,
  country text not null default 'PT',
  delivery_address text,
  delivery_city text,
  delivery_country text,
  trade_registry_path text,
  rejected_reason text,
  suspended_reason text,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
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

create or replace function public.is_approved_buyer(_user_id uuid)
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

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  status public.vehicle_status not null default 'draft',
  make text not null,
  model text not null,
  variant text,
  year integer not null check (year between 1900 and 2100),
  mileage integer not null default 0 check (mileage >= 0),
  color text,
  fuel_type text,
  transmission text,
  power_cv integer check (power_cv is null or power_cv >= 0),
  doors integer check (doors is null or doors between 1 and 8),
  condition text,
  description text,
  vin text,
  origin_plate text,
  coc_path text,
  damage_report_path text,
  appraisal_path text,
  service_history_path text,
  photos text[] not null default '{}',
  additional_services jsonb not null default '[]'::jsonb,
  legalization_cost integer not null default 0 check (legalization_cost >= 0),
  purchase_price integer check (purchase_price is null or purchase_price >= 0),
  market_price_ref integer check (market_price_ref is null or market_price_ref >= 0),
  lead_time_days integer check (lead_time_days is null or lead_time_days >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.auctions (
  id uuid primary key default gen_random_uuid(),
  lot_number text not null unique,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  status public.auction_status not null default 'scheduled',
  mode public.auction_mode not null default 'standard',
  starting_price integer not null check (starting_price >= 0),
  reserve_price integer not null check (reserve_price >= 0),
  buy_now_price integer check (buy_now_price is null or buy_now_price >= 0),
  current_price integer not null check (current_price >= 0),
  bid_increments integer[] not null default array[10000, 20000, 50000],
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  winner_id uuid references auth.users(id) on delete set null,
  bid_count integer not null default 0 check (bid_count >= 0),
  viewer_count integer not null default 0 check (viewer_count >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (current_price >= starting_price)
);

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null check (amount >= 0),
  status public.bid_status not null default 'active',
  is_buy_now boolean not null default false,
  max_autobid_amount integer check (max_autobid_amount is null or max_autobid_amount >= amount),
  is_autobid boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null unique references public.auctions(id) on delete restrict,
  buyer_id uuid not null references auth.users(id) on delete restrict,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  winning_bid_id uuid references public.bids(id) on delete set null,
  amount integer not null check (amount >= 0),
  status public.order_status not null default 'pending_payment',
  delivery_status public.delivery_status not null default 'pending',
  deposit_amount integer not null default 0 check (deposit_amount >= 0),
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.negotiations (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status public.negotiation_status not null default 'open',
  max_rounds integer not null default 5 check (max_rounds between 1 and 10),
  expires_at timestamptz not null,
  accepted_amount integer check (accepted_amount is null or accepted_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (auction_id, buyer_id)
);

create table public.negotiation_rounds (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  round_number integer not null check (round_number > 0),
  initiated_by public.negotiation_actor not null,
  amount integer not null check (amount >= 0),
  message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (negotiation_id, round_number)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  auction_id uuid not null references public.auctions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, auction_id)
);

create index profiles_status_idx on public.profiles(status);
create index user_roles_user_id_idx on public.user_roles(user_id);
create index vehicles_status_idx on public.vehicles(status);
create index vehicles_make_model_idx on public.vehicles(make, model);
create index auctions_status_ends_at_idx on public.auctions(status, ends_at);
create index auctions_vehicle_id_idx on public.auctions(vehicle_id);
create index bids_auction_amount_idx on public.bids(auction_id, amount desc);
create index bids_bidder_id_idx on public.bids(bidder_id);
create index orders_buyer_id_idx on public.orders(buyer_id);
create index negotiations_buyer_id_idx on public.negotiations(buyer_id);
create index notification_user_read_idx on public.notifications(user_id, read_at, created_at desc);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_vehicles_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

create trigger set_auctions_updated_at
before update on public.auctions
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger set_negotiations_updated_at
before update on public.negotiations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
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

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace view public.public_vehicles as
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
  (damage_report_path is not null) as has_damage_report,
  (appraisal_path is not null) as has_appraisal,
  (service_history_path is not null) as has_service_history,
  additional_services,
  legalization_cost,
  market_price_ref,
  lead_time_days,
  created_at,
  updated_at
from public.vehicles
where status in ('active', 'sold');

create or replace view public.public_auctions as
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
  (a.current_price >= a.reserve_price) as reserve_met,
  a.created_at,
  a.updated_at
from public.auctions a
join public.vehicles v on v.id = a.vehicle_id
where a.status in ('scheduled', 'active', 'ended')
  and v.status in ('active', 'sold');

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.vehicles enable row level security;
alter table public.auctions enable row level security;
alter table public.bids enable row level security;
alter table public.orders enable row level security;
alter table public.negotiations enable row level security;
alter table public.negotiation_rounds enable row level security;
alter table public.notifications enable row level security;
alter table public.watchlist enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'))
with check (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "user_roles_select_own_or_admin"
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "user_roles_admin_all"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "vehicles_admin_all"
on public.vehicles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "auctions_admin_all"
on public.auctions for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "bids_select_approved_buyers_or_admin"
on public.bids for select
to authenticated
using (public.is_approved_buyer(auth.uid()) or public.has_role(auth.uid(), 'admin'));

create policy "bids_insert_approved_buyer"
on public.bids for insert
to authenticated
with check (
  bidder_id = auth.uid()
  and public.is_approved_buyer(auth.uid())
  and exists (
    select 1
    from public.auctions a
    where a.id = auction_id
      and a.status = 'active'
      and now() between a.starts_at and a.ends_at
  )
);

create policy "bids_admin_update"
on public.bids for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "orders_select_own_or_admin"
on public.orders for select
to authenticated
using (buyer_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "orders_admin_all"
on public.orders for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "negotiations_select_own_or_admin"
on public.negotiations for select
to authenticated
using (buyer_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "negotiations_admin_all"
on public.negotiations for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "negotiation_rounds_select_participants"
on public.negotiation_rounds for select
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  or exists (
    select 1
    from public.negotiations n
    where n.id = negotiation_id
      and n.buyer_id = auth.uid()
  )
);

create policy "negotiation_rounds_insert_participants"
on public.negotiation_rounds for insert
to authenticated
with check (
  public.has_role(auth.uid(), 'admin')
  or exists (
    select 1
    from public.negotiations n
    where n.id = negotiation_id
      and n.buyer_id = auth.uid()
      and n.status = 'open'
  )
);

create policy "notifications_select_own_or_admin"
on public.notifications for select
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "notifications_update_own_read_state"
on public.notifications for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "notifications_admin_all"
on public.notifications for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "watchlist_select_own_or_admin"
on public.watchlist for select
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "watchlist_insert_own_approved_buyer"
on public.watchlist for insert
to authenticated
with check (user_id = auth.uid() and public.is_approved_buyer(auth.uid()));

create policy "watchlist_delete_own"
on public.watchlist for delete
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

revoke all on public.profiles from anon, authenticated;
revoke all on public.user_roles from anon, authenticated;
revoke all on public.vehicles from anon, authenticated;
revoke all on public.auctions from anon, authenticated;
revoke all on public.bids from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.negotiations from anon, authenticated;
revoke all on public.negotiation_rounds from anon, authenticated;
revoke all on public.notifications from anon, authenticated;
revoke all on public.watchlist from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.public_vehicles, public.public_auctions to anon, authenticated;

grant select on public.profiles, public.user_roles to authenticated;
grant insert (
  id,
  company_name,
  vat_number,
  contact_name,
  contact_phone,
  address,
  city,
  country,
  delivery_address,
  delivery_city,
  delivery_country,
  trade_registry_path
) on public.profiles to authenticated;
grant update (
  company_name,
  vat_number,
  contact_name,
  contact_phone,
  address,
  city,
  country,
  delivery_address,
  delivery_city,
  delivery_country,
  trade_registry_path,
  updated_at
) on public.profiles to authenticated;

grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update, delete on public.vehicles to authenticated;
grant select, insert, update, delete on public.auctions to authenticated;
grant select, insert, update on public.bids to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.negotiations to authenticated;
grant select, insert on public.negotiation_rounds to authenticated;
grant select, insert, delete on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant select, insert, delete on public.watchlist to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('vehicle-photos', 'vehicle-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('vehicle-documents', 'vehicle-documents', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('trade-registry', 'trade-registry', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "vehicle_photos_public_select"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'vehicle-photos');

create policy "vehicle_photos_admin_write"
on storage.objects for all
to authenticated
using (bucket_id = 'vehicle-photos' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'vehicle-photos' and public.has_role(auth.uid(), 'admin'));

create policy "vehicle_documents_admin_all"
on storage.objects for all
to authenticated
using (bucket_id = 'vehicle-documents' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'vehicle-documents' and public.has_role(auth.uid(), 'admin'));

create policy "trade_registry_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trade-registry'
  and owner = auth.uid()
  and name like auth.uid()::text || '/%'
);

create policy "trade_registry_owner_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'trade-registry'
  and (owner = auth.uid() or public.has_role(auth.uid(), 'admin'))
);

create policy "trade_registry_admin_all"
on storage.objects for all
to authenticated
using (bucket_id = 'trade-registry' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'trade-registry' and public.has_role(auth.uid(), 'admin'));
