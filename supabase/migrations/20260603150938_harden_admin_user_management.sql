create or replace function public.approve_user(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not private.has_role(current_user_id, 'admin') then
    raise exception 'Sem permissões para aprovar utilizadores.';
  end if;

  if target_user_id = current_user_id then
    raise exception 'Não pode alterar o próprio estado por esta ação.';
  end if;

  if private.has_role(target_user_id, 'admin') then
    raise exception 'Não pode alterar contas de administrador por esta ação.';
  end if;

  update public.profiles
  set
    status = 'approved',
    approved_at = now(),
    approved_by = current_user_id,
    rejected_reason = null,
    suspended_reason = null,
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Utilizador não encontrado.';
  end if;

  insert into public.user_roles (user_id, role)
  values (target_user_id, 'buyer')
  on conflict (user_id, role) do nothing;

  insert into public.notifications (user_id, type, title, body)
  values (
    target_user_id,
    'account_approved',
    'Conta aprovada',
    'A sua conta ReDrive foi aprovada. Já pode aceder à área de comprador.'
  );

  return true;
end;
$$;

create or replace function public.reject_user(target_user_id uuid, reason text default null)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not private.has_role(current_user_id, 'admin') then
    raise exception 'Sem permissões para rejeitar utilizadores.';
  end if;

  if target_user_id = current_user_id then
    raise exception 'Não pode alterar o próprio estado por esta ação.';
  end if;

  if private.has_role(target_user_id, 'admin') then
    raise exception 'Não pode alterar contas de administrador por esta ação.';
  end if;

  update public.profiles
  set
    status = 'rejected',
    approved_at = null,
    approved_by = null,
    rejected_reason = nullif(trim(reason), ''),
    suspended_reason = null,
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Utilizador não encontrado.';
  end if;

  insert into public.notifications (user_id, type, title, body)
  values (
    target_user_id,
    'account_rejected',
    'Conta rejeitada',
    coalesce(nullif(trim(reason), ''), 'O pedido de acesso à ReDrive foi rejeitado.')
  );

  return true;
end;
$$;

create or replace function public.suspend_user(target_user_id uuid, reason text default null)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not private.has_role(current_user_id, 'admin') then
    raise exception 'Sem permissões para suspender utilizadores.';
  end if;

  if target_user_id = current_user_id then
    raise exception 'Não pode suspender a própria conta.';
  end if;

  if private.has_role(target_user_id, 'admin') then
    raise exception 'Não pode alterar contas de administrador por esta ação.';
  end if;

  update public.profiles
  set
    status = 'suspended',
    approved_at = null,
    approved_by = null,
    suspended_reason = nullif(trim(reason), ''),
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Utilizador não encontrado.';
  end if;

  return true;
end;
$$;
