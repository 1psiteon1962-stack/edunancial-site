-- Learner progress schema
--
-- Current application auth is not yet Supabase-auth-native for end users.
-- In the near term, writes/reads are expected to run server-side using the
-- service-role key. Self-access RLS policies are included now so this schema
-- is future-ready once end-user auth is bound to auth.uid().

create or replace function public.set_learning_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_lesson_progress (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  course_id text not null,
  lesson_id text not null,
  track_code text not null check (track_code in ('RED', 'WHITE', 'BLUE', 'GOLD', 'ORANGE', 'BLACK')),
  level_code text not null check (level_code in ('L1', 'L2', 'L3', 'L4', 'L5')),
  lesson_number integer not null check (lesson_number >= 1),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  seconds_watched integer not null default 0 check (seconds_watched >= 0),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  first_viewed_at timestamptz,
  last_viewed_at timestamptz,
  completed_at timestamptz,
  access_tier_at_record text not null check (access_tier_at_record in ('free', 'test-drive', 'basic', 'pro', 'gold', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

comment on table public.user_lesson_progress is
  'Per-user lesson progress. App currently uses server-side service-role access; self-access RLS policies are pre-provisioned for auth.uid() rollout.';

create table if not exists public.user_track_progress (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  track_code text not null check (track_code in ('RED', 'WHITE', 'BLUE', 'GOLD', 'ORANGE', 'BLACK')),
  lessons_started integer not null default 0 check (lessons_started >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  total_lessons integer not null default 0 check (total_lessons >= 0),
  completion_percentage integer not null default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  current_level text check (current_level is null or current_level in ('L1', 'L2', 'L3', 'L4', 'L5')),
  current_lesson_id text,
  last_lesson_id text,
  last_accessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, track_code)
);

comment on table public.user_track_progress is
  'Per-user aggregate track progress cache. App currently uses server-side service-role access; self-access RLS policies are pre-provisioned for auth.uid() rollout.';

create index if not exists user_lesson_progress_user_id_idx on public.user_lesson_progress (user_id);
create index if not exists user_lesson_progress_user_track_idx on public.user_lesson_progress (user_id, track_code);
create index if not exists user_lesson_progress_user_course_idx on public.user_lesson_progress (user_id, course_id);
create index if not exists user_lesson_progress_user_status_idx on public.user_lesson_progress (user_id, status);
create index if not exists user_lesson_progress_user_last_viewed_idx on public.user_lesson_progress (user_id, last_viewed_at desc);
create index if not exists user_lesson_progress_user_track_level_idx on public.user_lesson_progress (user_id, track_code, level_code);

create index if not exists user_track_progress_user_id_idx on public.user_track_progress (user_id);
create index if not exists user_track_progress_user_last_accessed_idx on public.user_track_progress (user_id, last_accessed_at desc);

alter table public.user_lesson_progress enable row level security;
alter table public.user_track_progress enable row level security;

-- Explicit service-role policies keep intent visible while app-side access is service-role based.
create policy "service_role_all_user_lesson_progress"
  on public.user_lesson_progress
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service_role_all_user_track_progress"
  on public.user_track_progress
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Future-ready self-access policies for Supabase-auth-native sessions.
create policy "user_select_own_lesson_progress"
  on public.user_lesson_progress
  for select
  using (user_id = auth.uid()::text);

create policy "user_insert_own_lesson_progress"
  on public.user_lesson_progress
  for insert
  with check (user_id = auth.uid()::text);

create policy "user_update_own_lesson_progress"
  on public.user_lesson_progress
  for update
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "user_delete_own_lesson_progress"
  on public.user_lesson_progress
  for delete
  using (user_id = auth.uid()::text);

create policy "user_select_own_track_progress"
  on public.user_track_progress
  for select
  using (user_id = auth.uid()::text);

create policy "user_insert_own_track_progress"
  on public.user_track_progress
  for insert
  with check (user_id = auth.uid()::text);

create policy "user_update_own_track_progress"
  on public.user_track_progress
  for update
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "user_delete_own_track_progress"
  on public.user_track_progress
  for delete
  using (user_id = auth.uid()::text);

drop trigger if exists user_lesson_progress_set_updated_at on public.user_lesson_progress;
create trigger user_lesson_progress_set_updated_at
  before update on public.user_lesson_progress
  for each row execute function public.set_learning_progress_updated_at();

drop trigger if exists user_track_progress_set_updated_at on public.user_track_progress;
create trigger user_track_progress_set_updated_at
  before update on public.user_track_progress
  for each row execute function public.set_learning_progress_updated_at();
