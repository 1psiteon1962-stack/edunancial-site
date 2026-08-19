-- Durable cross-service resume/activity tracking.
-- Complements course_progress and lesson progress with a generic checkpoint for
-- any authenticated service (course, calculator, assessment, tool, workflow).

create table if not exists public.member_service_progress (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  service_type text not null check (char_length(service_type) between 1 and 64),
  service_id text not null check (char_length(service_id) between 1 and 160),
  resource_id text,
  resume_path text not null check (resume_path like '/%'),
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  position_seconds integer not null default 0 check (position_seconds >= 0),
  state jsonb not null default '{}'::jsonb,
  first_started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, service_type, service_id)
);

create index if not exists member_service_progress_user_activity_idx
  on public.member_service_progress (user_id, last_activity_at desc);
create index if not exists member_service_progress_user_service_idx
  on public.member_service_progress (user_id, service_type, service_id);

alter table public.member_service_progress enable row level security;

create policy "service_role_all_member_service_progress"
  on public.member_service_progress
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "user_select_own_member_service_progress"
  on public.member_service_progress for select
  using (user_id = auth.uid()::text);
create policy "user_insert_own_member_service_progress"
  on public.member_service_progress for insert
  with check (user_id = auth.uid()::text);
create policy "user_update_own_member_service_progress"
  on public.member_service_progress for update
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
create policy "user_delete_own_member_service_progress"
  on public.member_service_progress for delete
  using (user_id = auth.uid()::text);

drop trigger if exists member_service_progress_set_updated_at on public.member_service_progress;
create trigger member_service_progress_set_updated_at
  before update on public.member_service_progress
  for each row execute function public.set_learning_progress_updated_at();
