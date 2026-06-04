-- Allow approved buyers (and admins) to read vehicle-documents storage objects.
create policy "vehicle_documents_approved_buyer_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vehicle-documents'
  and (
    private.has_role((select auth.uid()), 'admin')
    or private.is_approved_buyer((select auth.uid()))
  )
);

-- RPC: return document paths to admins or approved buyers (status active/sold).
create or replace function public.get_vehicle_documents(target_vehicle_id uuid)
returns table (
  damage_report_path text,
  appraisal_path text,
  service_history_path text,
  coc_path text
)
language plpgsql
stable
security definer
set search_path = public, private
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if not (
    private.has_role(auth.uid(), 'admin')
    or private.is_approved_buyer(auth.uid())
  ) then
    raise exception 'not authorised' using errcode = '42501';
  end if;

  return query
  select
    v.damage_report_path,
    v.appraisal_path,
    v.service_history_path,
    v.coc_path
  from public.vehicles v
  where v.id = target_vehicle_id
    and (
      private.has_role(auth.uid(), 'admin')
      or v.status in ('active', 'sold')
    );
end;
$$;

revoke all on function public.get_vehicle_documents(uuid) from public;
grant execute on function public.get_vehicle_documents(uuid) to authenticated;
