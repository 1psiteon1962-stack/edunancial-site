-- Persistent beta tester access.
-- Gold-equivalent access begins on first authenticated use and expires 90 days later.

create table if not exists public.beta_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'issued' check (status in ('issued','active','expired','revoked')),
  access_tier text not null default 'gold' check (access_tier = 'gold'),
  issued_at timestamptz not null default now(),
  first_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  reissue_count integer not null default 0,
  generation integer not null default 1,
  created_by text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create unique index if not exists beta_access_grants_email_lower_idx on public.beta_access_grants (lower(email));
create index if not exists beta_access_grants_status_idx on public.beta_access_grants (status, expires_at);
alter table public.beta_access_grants enable row level security;

create or replace function public.activate_beta_access(p_user_id uuid)
returns public.beta_access_grants
language plpgsql
security definer
set search_path = public
as $$
declare result public.beta_access_grants;
begin
  update public.beta_access_grants
  set
    status = case when status = 'issued' then 'active' else status end,
    first_used_at = case when status = 'issued' then coalesce(first_used_at, now()) else first_used_at end,
    expires_at = case when status = 'issued' then coalesce(expires_at, now() + interval '90 days') else expires_at end,
    updated_at = now()
  where user_id = p_user_id
  returning * into result;

  if result.user_id is not null and result.status = 'active' and result.expires_at <= now() then
    update public.beta_access_grants set status = 'expired', updated_at = now()
    where user_id = p_user_id returning * into result;
  end if;
  return result;
end;
$$;

comment on table public.beta_access_grants is 'Non-revenue beta entitlements: Gold-equivalent access starts at first authenticated use and expires after 90 days.';
