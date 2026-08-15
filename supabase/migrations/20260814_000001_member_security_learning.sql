-- Member privacy, learning continuity, and security controls
-- Migration: 20260814_000001_member_security_learning.sql
--
-- Supabase Auth (auth.users) is the identity authority. Application tables
-- reference auth.users.id (UUID) and are protected by row-level security.
-- No password, access token, refresh token, raw PIN, or payment-card data is
-- stored in these tables.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  country text,
  bio text,
  membership_tier text not null default 'free'
    check (membership_tier in ('free','basic','premium','enterprise','beta')),
  assessment_completed boolean not null default false,
  overall_score numeric(6,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  last_lesson_id text,
  completed_lesson_ids text[] not null default '{}',
  progress_percent numeric(5,2) not null default 0
    check (progress_percent >= 0 and progress_percent <= 100),
  last_position_seconds integer not null default 0
    check (last_position_seconds >= 0),
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists course_progress_user_id_idx
  on public.course_progress(user_id);
create index if not exists course_progress_last_activity_idx
  on public.course_progress(user_id, last_activity_at desc);

create table if not exists public.user_security_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pin_hash text,
  pin_failed_attempts integer not null default 0
    check (pin_failed_attempts >= 0),
  pin_locked_until timestamptz,
  pin_changed_at timestamptz,
  require_pin_for_sensitive_actions boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  outcome text not null default 'success'
    check (outcome in ('success','failure','blocked')),
  request_id text,
  ip_fingerprint text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_events_user_created_idx
  on public.security_events(user_id, created_at desc);
create index if not exists security_events_type_created_idx
  on public.security_events(event_type, created_at desc);

-- RLS is fail-closed. Authenticated users can access only their own profile,
-- learning progress, security settings, and security-event history.
alter table public.user_profiles enable row level security;
alter table public.course_progress enable row level security;
alter table public.user_security_settings enable row level security;
alter table public.security_events enable row level security;

create policy "profile_select_own" on public.user_profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "profile_insert_own" on public.user_profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "profile_update_own" on public.user_profiles
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "progress_select_own" on public.course_progress
  for select to authenticated using (auth.uid() = user_id);
create policy "progress_insert_own" on public.course_progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "progress_update_own" on public.course_progress
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "progress_delete_own" on public.course_progress
  for delete to authenticated using (auth.uid() = user_id);

create policy "security_settings_select_own" on public.user_security_settings
  for select to authenticated using (auth.uid() = user_id);
create policy "security_settings_insert_own" on public.user_security_settings
  for insert to authenticated with check (auth.uid() = user_id);
create policy "security_settings_update_own" on public.user_security_settings
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "security_events_select_own" on public.security_events
  for select to authenticated using (auth.uid() = user_id);
create policy "security_events_insert_own" on public.security_events
  for insert to authenticated with check (auth.uid() = user_id);

-- Generic updated_at trigger used only if one is not already present.
create or replace function public.set_member_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_member_updated_at();

drop trigger if exists course_progress_updated_at on public.course_progress;
create trigger course_progress_updated_at
  before update on public.course_progress
  for each row execute function public.set_member_updated_at();

drop trigger if exists user_security_settings_updated_at on public.user_security_settings;
create trigger user_security_settings_updated_at
  before update on public.user_security_settings
  for each row execute function public.set_member_updated_at();

-- Prevent ordinary authenticated users from changing their own paid tier.
-- They may update other profile fields through a SECURITY DEFINER RPC that
-- explicitly excludes membership_tier. Payment/webhook service-role code is
-- the only path that should modify paid access.
revoke update (membership_tier) on public.user_profiles from authenticated;

create or replace function public.update_own_profile(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_country text,
  p_bio text
)
returns public.user_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.user_profiles;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  update public.user_profiles
     set first_name = left(coalesce(p_first_name, ''), 100),
         last_name = left(coalesce(p_last_name, ''), 100),
         phone = nullif(left(coalesce(p_phone, ''), 50), ''),
         country = nullif(left(coalesce(p_country, ''), 100), ''),
         bio = nullif(left(coalesce(p_bio, ''), 1000), '')
   where user_id = auth.uid()
   returning * into result;

  return result;
end;
$$;

grant execute on function public.update_own_profile(text,text,text,text,text) to authenticated;
