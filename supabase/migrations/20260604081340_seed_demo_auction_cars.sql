with seed_vehicles as (
  select *
  from (
    values
      (
        '10000000-0000-4000-8000-000000000001'::uuid,
        'BMW', 'M4', 'Competition M xDrive', 2022, 12450, 'Brooklyn Grey', 'Gasolina', 'Automática 8-Vel', 510, 2, 'Excelente',
        'BMW M4 Competition M xDrive importado da Alemanha. Único proprietário, manutenção em concessionário oficial, pacote Carbono Exterior, jantes 826M forjadas e áudio Harman Kardon.',
        'WBS12A90D2J2X8782', 'M-XX 1234',
        array[
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
          'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=1200&q=80'
        ]::text[],
        '[{"name":"Garantia 12 meses","price":75000},{"name":"Transporte para concessão","price":35000}]'::jsonb,
        850000, 8200000, 12, 5500000, 6800000, 8150000, 6500000, array[10000, 20000, 50000]::integer[], 18, 42
      ),
      (
        '10000000-0000-4000-8000-000000000002'::uuid,
        'Porsche', '911', 'Carrera GTS', 2022, 14280, 'Jet Black Metallic', 'Gasolina', 'PDK 8-Vel', 480, 2, 'Excelente',
        'Porsche 911 Carrera GTS com pacote Sport Chrono, escape desportivo, bancos desportivos adaptáveis Plus e histórico Porsche completo.',
        'WP0ZZZ99ZLS200118', 'S-PO 9921',
        array[
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80'
        ]::text[],
        '[{"name":"Inspeção 150 pontos","price":25000},{"name":"Transporte premium fechado","price":95000}]'::jsonb,
        1250000, 14800000, 16, 9000000, 12500000, 14500000, 11600000, array[25000, 50000, 100000]::integer[], 11, 68
      ),
      (
        '10000000-0000-4000-8000-000000000003'::uuid,
        'Volkswagen', 'Golf', '1.6 TDI Highline', 2021, 68500, 'Branco Puro', 'Gasóleo', 'Manual 6-Vel', 115, 5, 'Bom',
        'Volkswagen Golf TDI em excelente estado geral, ideal para frota empresarial, consumo reduzido e manutenção documentada.',
        'WVWZZZAUZMW123456', 'HH-VW 4488',
        array[
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80'
        ]::text[],
        '[{"name":"Garantia 6 meses","price":35000},{"name":"Revisão pré-entrega","price":18000}]'::jsonb,
        320000, 1650000, 8, 800000, 1100000, 1450000, 960000, array[5000, 10000, 20000]::integer[], 7, 24
      ),
      (
        '10000000-0000-4000-8000-000000000004'::uuid,
        'Mercedes-Benz', 'C220d', 'AMG Line', 2020, 89400, 'Cinza Selenita', 'Gasóleo', 'Automática 9G-Tronic', 194, 4, 'Bom',
        'Mercedes C220d AMG Line com faróis Multibeam LED, MBUX widescreen, bancos desportivos e histórico completo de manutenção.',
        'WDD2050211R789012', 'M-MB 7890',
        array[
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80',
          'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1200&q=80'
        ]::text[],
        '[{"name":"Garantia 12 meses","price":60000},{"name":"Transporte para concessão","price":30000}]'::jsonb,
        420000, 3400000, 10, 2200000, 2900000, null, 2550000, array[10000, 20000, 50000]::integer[], 9, 36
      ),
      (
        '10000000-0000-4000-8000-000000000005'::uuid,
        'Audi', 'A4 Avant', '2.0 TDI S-Line', 2021, 54200, 'Azul Navarra', 'Gasóleo', 'S-Tronic 7-Vel', 190, 5, 'Excelente',
        'Audi A4 Avant S-Line com Virtual Cockpit, Matrix LED, bancos em pele Nappa, carrinha premium pronta para stock B2B.',
        'WAUZZZF45MA011223', 'IN-AU 5566',
        array[
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
          'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=1200&q=80'
        ]::text[],
        '[{"name":"Garantia 12 meses","price":55000},{"name":"Revisão pré-entrega","price":22000}]'::jsonb,
        480000, 4100000, 11, 2800000, 3300000, 3950000, 3150000, array[10000, 20000, 50000]::integer[], 14, 53
      )
  ) as v(
    id, make, model, variant, year, mileage, color, fuel_type, transmission, power_cv, doors,
    condition, description, vin, origin_plate, photos, additional_services, legalization_cost,
    market_price_ref, lead_time_days, starting_price, reserve_price, buy_now_price, current_price,
    bid_increments, bid_count, viewer_count
  )
), upserted_vehicles as (
  insert into public.vehicles (
    id, status, make, model, variant, year, mileage, color, fuel_type, transmission, power_cv, doors,
    condition, description, vin, origin_plate, photos, additional_services, legalization_cost,
    market_price_ref, lead_time_days, damage_report_path, appraisal_path, service_history_path, coc_path
  )
  select
    id, 'active'::public.vehicle_status, make, model, variant, year, mileage, color, fuel_type, transmission, power_cv, doors,
    condition, description, vin, origin_plate, photos, additional_services, legalization_cost,
    market_price_ref, lead_time_days,
    'demo-documents/' || id::text || '/damage-report.pdf',
    'demo-documents/' || id::text || '/appraisal.pdf',
    'demo-documents/' || id::text || '/service-history.pdf',
    'demo-documents/' || id::text || '/coc.pdf'
  from seed_vehicles
  on conflict (id) do update
  set
    status = excluded.status,
    make = excluded.make,
    model = excluded.model,
    variant = excluded.variant,
    year = excluded.year,
    mileage = excluded.mileage,
    color = excluded.color,
    fuel_type = excluded.fuel_type,
    transmission = excluded.transmission,
    power_cv = excluded.power_cv,
    doors = excluded.doors,
    condition = excluded.condition,
    description = excluded.description,
    vin = excluded.vin,
    origin_plate = excluded.origin_plate,
    photos = excluded.photos,
    additional_services = excluded.additional_services,
    legalization_cost = excluded.legalization_cost,
    market_price_ref = excluded.market_price_ref,
    lead_time_days = excluded.lead_time_days,
    damage_report_path = excluded.damage_report_path,
    appraisal_path = excluded.appraisal_path,
    service_history_path = excluded.service_history_path,
    coc_path = excluded.coc_path,
    updated_at = now()
  returning id
)
insert into public.auctions (
  lot_number, vehicle_id, status, mode, starting_price, reserve_price, buy_now_price, current_price,
  bid_increments, starts_at, ends_at, bid_count, viewer_count
)
select
  'DEMO-' || lpad(row_number() over (order by id)::text, 3, '0'),
  id,
  'active'::public.auction_status,
  'standard'::public.auction_mode,
  starting_price,
  reserve_price,
  buy_now_price,
  current_price,
  bid_increments,
  now() - interval '1 hour',
  now() + interval '7 days',
  bid_count,
  viewer_count
from seed_vehicles
on conflict (lot_number) do update
set
  vehicle_id = excluded.vehicle_id,
  status = 'active'::public.auction_status,
  mode = excluded.mode,
  starting_price = excluded.starting_price,
  reserve_price = excluded.reserve_price,
  buy_now_price = excluded.buy_now_price,
  current_price = excluded.current_price,
  bid_increments = excluded.bid_increments,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  bid_count = excluded.bid_count,
  viewer_count = excluded.viewer_count,
  winner_id = null,
  updated_at = now();
