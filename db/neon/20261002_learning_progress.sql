-- Provider-neutral learner progress persistence for Neon/PostgreSQL.
-- Preserves existing application row shapes and all eight Edunancial tracks.

create or replace function public.set_learning_progress_updated_at()
returns trigger language plpgsql as $$
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
  track_code text not null check (track_code in ('RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK')),
  level_code text not null check (level_code in ('L1','L2','L3','L4','L5')),
  lesson_number integer not null check (lesson_number >= 1),
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  seconds_watched integer not null default 0 check (seconds_watched >= 0),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  first_viewed_at timestamptz,
  last_viewed_at timestamptz,
  completed_at timestamptz,
  access_tier_at_record text not null check (access_tier_at_record in ('free','test-drive','basic','pro','gold','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.user_track_progress (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  track_code text not null check (track_code in ('RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK')),
  lessons_started integer not null default 0 check (lessons_started >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  total_lessons integer not null default 0 check (total_lessons >= 0),
  completion_percentage integer not null default 0 check (completion_percentage between 0 and 100),
  current_level text check (current_level is null or current_level in ('L1','L2','L3','L4','L5')),
  current_lesson_id text,
  last_lesson_id text,
  last_accessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, track_code)
);

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id text not null,
  last_lesson_id text,
  completed_lesson_ids text[] not null default '{}',
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.user_applied_learning_decisions (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  scenario_id text not null,
  lesson_id text,
  track_code text not null check (track_code in ('RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK')),
  level_code integer not null check (level_code between 2 and 5),
  rationale text not null,
  selected_choice_id text,
  requested_information jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  risks_identified jsonb not null default '[]'::jsonb,
  tracks_considered jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_competency_evidence (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  lesson_id text,
  scenario_id text,
  track_code text not null check (track_code in ('RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK')),
  level_code integer not null check (level_code between 2 and 5),
  stage text not null check (stage in ('apply','analyze','strategize','integrate')),
  competency_tag text not null,
  evidence_type text not null check (evidence_type in ('lesson-completion','scenario-decision','quiz','ai-coach','reflection')),
  score integer not null check (score between 0 and 100),
  demonstrated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_lesson_progress_user_id_idx on public.user_lesson_progress(user_id);
create index if not exists user_lesson_progress_user_course_idx on public.user_lesson_progress(user_id,course_id);
create index if not exists user_track_progress_user_id_idx on public.user_track_progress(user_id);
create index if not exists course_progress_user_id_idx on public.course_progress(user_id);
create index if not exists course_progress_last_activity_idx on public.course_progress(user_id,last_activity_at desc);
create index if not exists user_applied_learning_decisions_user_idx on public.user_applied_learning_decisions(user_id,submitted_at desc);
create index if not exists user_competency_evidence_user_idx on public.user_competency_evidence(user_id,demonstrated_at desc);

drop trigger if exists user_lesson_progress_set_updated_at on public.user_lesson_progress;
create trigger user_lesson_progress_set_updated_at before update on public.user_lesson_progress for each row execute function public.set_learning_progress_updated_at();
drop trigger if exists user_track_progress_set_updated_at on public.user_track_progress;
create trigger user_track_progress_set_updated_at before update on public.user_track_progress for each row execute function public.set_learning_progress_updated_at();
drop trigger if exists course_progress_set_updated_at on public.course_progress;
create trigger course_progress_set_updated_at before update on public.course_progress for each row execute function public.set_learning_progress_updated_at();
drop trigger if exists user_applied_learning_decisions_set_updated_at on public.user_applied_learning_decisions;
create trigger user_applied_learning_decisions_set_updated_at before update on public.user_applied_learning_decisions for each row execute function public.set_learning_progress_updated_at();
drop trigger if exists user_competency_evidence_set_updated_at on public.user_competency_evidence;
create trigger user_competency_evidence_set_updated_at before update on public.user_competency_evidence for each row execute function public.set_learning_progress_updated_at();
