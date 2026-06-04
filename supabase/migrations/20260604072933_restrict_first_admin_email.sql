create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
  current_user_email text;
  allowed_admin_email constant text := 'plusroimkd@gmail.com';
begin
  if current_user_id is null then
    raise exception 'É necessário iniciar sessão.';
  end if;

  select lower(email)
  into current_user_email
  from auth.users
  where id = current_user_id;

  if current_user_email is distinct from allowed_admin_email then
    raise exception 'Esta conta não está autorizada a configurar o primeiro administrador.';
  end if;

  if exists (
    select 1
    from public.user_roles
    where role = 'admin'
  ) then
    raise exception 'O primeiro administrador já foi configurado.';
  end if;

  insert into public.user_roles (user_id, role)
  values (current_user_id, 'admin')
  on conflict (user_id, role) do nothing;

  insert into public.user_roles (user_id, role)
  values (current_user_id, 'buyer')
  on conflict (user_id, role) do nothing;

  update public.profiles
  set
    status = 'approved',
    approved_at = now(),
    approved_by = current_user_id,
    rejected_reason = null,
    suspended_reason = null,
    updated_at = now()
  where id = current_user_id;

  return true;
end;
$$;
