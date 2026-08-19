-- Cross-service member continuity and privacy-safe usage tracking.
-- Stores product usage needed for "continue where you left off" and aggregate
-- engagement analysis. It intentionally stores no payment-card data, auth
-- tokens, raw IP addresses, or arbitrary page contents.

create table if not exists public.member_service_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_type text not null check (service_type in ('course','book','calculator','assessment','tool','webinar','resource','other')),
  service_id text not null,
  content_id text,
  locale text,
  status text not null default 'in_progress' check (status in ('not_started','in_progress','completed')),
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  resume_path text,
  first_started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique(user_id, service_type, service_id)
);

create index if not exists member_service_progress_user_activity_idx
  on public.member_service_progress(user_id, last_activity_at desc);
create index if not exists member_service_progress_service_idx
  on public.member_service_progress(service_type, service_id, last_activity_at desc);

alter table public.member_service_progress enable row level security;

create policy "member_service_progress_select_own"
  on public.member_service_progress for select to authenticated
  using (auth.uid() = user_id);
create policy "member_service_progress_insert_own"
  on public.member_service_progress for insert to authenticated
  with check (auth.uid() = user_id);
create policy "member_service_progress_update_own"
  on public.member_service_progress for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "member_service_progress_delete_own"
  on public.member_service_progress for delete to authenticated
  using (auth.uid() = user_id);

drop trigger if exists member_service_progress_updated_at on public.member_service_progress;
create trigger member_service_progress_updated_at
  before update on public.member_service_progress
  for each row execute function public.set_member_updated_at();

comment on table public.member_service_progress is
  'Privacy-minimized per-user continuity state for courses and other services. Supports resume experiences and aggregate product engagement.';
