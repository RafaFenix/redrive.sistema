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
  updated_at,
  (coc_path is not null) as has_coc
from public.vehicles
where status in ('active', 'sold');

grant select on public.public_vehicles to anon, authenticated;
