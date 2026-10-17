-- PR A: Alpha/Beta access codes (single redemption, 90-day Gold-equivalent access).
-- Reuses public.beta_access_grants (20260825_000001) as the ONE authoritative entitlement table.
-- Codes are stored only as keyed HMAC-SHA256 hashes (pepper = BETA_CODE_PEPPER env, server-only).
-- The 90-day clock starts at successful redemption, never at issuance.

create table if not exists public.beta_access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null,
  code_hint text not null,                         -- last 4 characters only, for owner identification
  batch_label text,
  entitlement_type text not null default 'gold_beta_90d' check (entitlement_type = 'gold_beta_90d'),
  duration_days integer not null default 90 check (duration_days between 1 and 365),
  status text not null default 'issued' check (status in ('issued','redeemed','revoked')),
  issued_at timestamptz not null default now(),
  issued_by text not null,
  redeemed_by_user_id uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint beta_access_codes_code_hash_key unique (code_hash),
  constraint beta_access_codes_redemption_consistent check (
    (status = 'redeemed' and redeemed_by_user_id is not null and redeemed_at is not null and expires_at is not null)
    or status <> 'redeemed'
  )
);

create index if not exists beta_access_codes_status_idx on public.beta_access_codes (status, issued_at desc);
create index if not exists beta_access_codes_redeemer_idx on public.beta_access_codes (redeemed_by_user_id);

-- Link a grant to the code that created it (nullable: legacy owner-created grants have no code).
alter table public.beta_access_grants add column if not exists code_id uuid references public.beta_access_codes(id) on delete set null;
alter table public.beta_access_grants add column if not exists extended_days integer not null default 0;

create table if not exists public.beta_access_audit (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references public.beta_access_codes(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  actor text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,       -- never contains plaintext codes
  created_at timestamptz not null default now()
);
create index if not exists beta_access_audit_created_idx on public.beta_access_audit (created_at desc);

alter table public.beta_access_codes enable row level security;
alter table public.beta_access_audit enable row level security;
-- No RLS policies are created: only the service-role client (server-side) can read or write.

-- Atomic, race-safe redemption.
-- Returns one row: outcome in ('redeemed','invalid','already_has_beta'), plus expires_at on success.
create or replace function public.redeem_beta_access_code(p_code_hash text, p_user_id uuid, p_email text)
returns table (outcome text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.beta_access_codes;
  v_grant public.beta_access_grants;
  v_expires timestamptz;
begin
  -- Lock the code row; concurrent redeemers of the same code serialize here.
  select * into v_code from public.beta_access_codes
  where code_hash = p_code_hash
  for update;

  if v_code.id is null or v_code.status <> 'issued' then
    insert into public.beta_access_audit (code_id, user_id, actor, action, metadata)
    values (v_code.id, p_user_id, 'member', 'beta.code.redeem.rejected',
            jsonb_build_object('reason', case when v_code.id is null then 'unknown' else v_code.status end));
    return query select 'invalid'::text, null::timestamptz;
    return;
  end if;

  -- Lock any existing grant for this user.
  select * into v_grant from public.beta_access_grants where user_id = p_user_id for update;

  if v_grant.user_id is not null
     and v_grant.status in ('issued','active')
     and (v_grant.expires_at is null or v_grant.expires_at > now()) then
    -- Do not burn a code on an account that already has live beta access.
    insert into public.beta_access_audit (code_id, user_id, actor, action, metadata)
    values (v_code.id, p_user_id, 'member', 'beta.code.redeem.rejected', jsonb_build_object('reason', 'already_has_beta'));
    return query select 'already_has_beta'::text, v_grant.expires_at;
    return;
  end if;

  v_expires := now() + make_interval(days => v_code.duration_days);

  if v_grant.user_id is null then
    insert into public.beta_access_grants (user_id, email, status, access_tier, issued_at, first_used_at, expires_at, created_by, code_id, notes)
    values (p_user_id, lower(p_email), 'active', 'gold', now(), now(), v_expires, 'beta-code', v_code.id, coalesce(v_code.batch_label, 'beta code'));
  else
    update public.beta_access_grants
    set status = 'active', first_used_at = now(), expires_at = v_expires, revoked_at = null,
        generation = generation + 1, code_id = v_code.id, extended_days = 0, updated_at = now()
    where user_id = p_user_id;
  end if;

  update public.beta_access_codes
  set status = 'redeemed', redeemed_by_user_id = p_user_id, redeemed_at = now(), expires_at = v_expires, updated_at = now()
  where id = v_code.id;

  insert into public.beta_access_audit (code_id, user_id, actor, action, metadata)
  values (v_code.id, p_user_id, 'member', 'beta.code.redeemed', jsonb_build_object('expires_at', v_expires));

  return query select 'redeemed'::text, v_expires;
end;
$$;

revoke all on function public.redeem_beta_access_code(text, uuid, text) from public, anon, authenticated;

-- Owner revocation of a code. If redeemed, the linked grant is revoked too. Paid entitlements are untouched.
create or replace function public.revoke_beta_access_code(p_code_id uuid, p_actor text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare v_code public.beta_access_codes;
begin
  select * into v_code from public.beta_access_codes where id = p_code_id for update;
  if v_code.id is null then return 'not_found'; end if;
  if v_code.status = 'revoked' then return 'already_revoked'; end if;

  update public.beta_access_codes set status = 'revoked', revoked_at = now(), revoked_by = p_actor, updated_at = now()
  where id = p_code_id;

  if v_code.redeemed_by_user_id is not null then
    update public.beta_access_grants set status = 'revoked', revoked_at = now(), updated_at = now()
    where user_id = v_code.redeemed_by_user_id and code_id = p_code_id;
  end if;

  insert into public.beta_access_audit (code_id, user_id, actor, action)
  values (p_code_id, v_code.redeemed_by_user_id, p_actor, 'beta.code.revoked');
  return 'revoked';
end;
$$;

-- Owner-authorized extension of a redeemed code's grant.
create or replace function public.extend_beta_access_code(p_code_id uuid, p_days integer, p_actor text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare v_code public.beta_access_codes; v_new timestamptz;
begin
  if p_days < 1 or p_days > 180 then raise exception 'extension must be between 1 and 180 days'; end if;
  select * into v_code from public.beta_access_codes where id = p_code_id for update;
  if v_code.id is null or v_code.status <> 'redeemed' then return null; end if;

  v_new := greatest(coalesce(v_code.expires_at, now()), now()) + make_interval(days => p_days);
  update public.beta_access_codes set expires_at = v_new, updated_at = now() where id = p_code_id;
  update public.beta_access_grants
  set expires_at = v_new, status = 'active', extended_days = extended_days + p_days, updated_at = now()
  where user_id = v_code.redeemed_by_user_id and code_id = p_code_id and status <> 'revoked';

  insert into public.beta_access_audit (code_id, user_id, actor, action, metadata)
  values (p_code_id, v_code.redeemed_by_user_id, p_actor, 'beta.code.extended', jsonb_build_object('days', p_days, 'expires_at', v_new));
  return v_new;
end;
$$;

revoke all on function public.revoke_beta_access_code(uuid, text) from public, anon, authenticated;
revoke all on function public.extend_beta_access_code(uuid, integer, text) from public, anon, authenticated;

comment on table public.beta_access_codes is 'Alpha/beta access codes. Only keyed hashes are stored. Redemption grants 90-day Gold-equivalent educational access via beta_access_grants; no payment, no subscription.';