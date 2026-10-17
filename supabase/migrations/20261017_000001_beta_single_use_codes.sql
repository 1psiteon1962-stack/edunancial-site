-- Single-use beta codes; store only keyed hashes. 90 days begins on redemption.
create table if not exists public.beta_invite_codes (
 id uuid primary key default gen_random_uuid(),
 code_hash text not null unique,
 created_at timestamptz not null default now(),
 redeemed_at timestamptz,
 redeemed_by uuid references auth.users(id),
 expires_at timestamptz,
 revoked_at timestamptz,
 constraint beta_code_consistent check ((redeemed_at is null and redeemed_by is null and expires_at is null) or (redeemed_at is not null and redeemed_by is not null and expires_at is not null))
);
create unique index if not exists beta_invite_codes_redeemed_by_unique on public.beta_invite_codes(redeemed_by) where redeemed_by is not null;
alter table public.beta_invite_codes enable row level security;
revoke all on public.beta_invite_codes from anon, authenticated;
create or replace function public.redeem_beta_invite(p_hash text, p_user uuid)
returns timestamptz language plpgsql security definer set search_path = public
as $$
declare v_code public.beta_invite_codes; v_expiry timestamptz;
begin
 if auth.uid() is distinct from p_user then raise exception 'Not authenticated as requested user'; end if;
 update public.beta_invite_codes set redeemed_at = now(), redeemed_by = p_user, expires_at = now() + interval '90 days'
 where code_hash = p_hash and redeemed_at is null and revoked_at is null
 returning * into v_code;
 if v_code.id is null then raise exception 'Invalid or previously redeemed code'; end if;
 insert into public.beta_access_grants(user_id,email,status,access_tier,first_used_at,expires_at,created_by)
 select p_user, lower(u.email), 'active','gold',v_code.redeemed_at,v_code.expires_at,'beta-code'
 from auth.users u where u.id=p_user
 on conflict (user_id) do update set status='active',access_tier='gold',first_used_at=excluded.first_used_at,expires_at=excluded.expires_at,revoked_at=null,updated_at=now();
 return v_code.expires_at;
end; $$;
revoke execute on function public.redeem_beta_invite(text,uuid) from public, anon;
grant execute on function public.redeem_beta_invite(text,uuid) to authenticated;
