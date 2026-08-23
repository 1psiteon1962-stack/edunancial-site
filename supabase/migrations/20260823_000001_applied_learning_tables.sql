-- Advanced applied-learning persistence for Levels 2-5.
-- Kept separate from Level 1 lesson/track progress so the current launch path remains unchanged.

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

create index if not exists user_applied_learning_decisions_user_idx
  on public.user_applied_learning_decisions (user_id, submitted_at desc);
create index if not exists user_applied_learning_decisions_scenario_idx
  on public.user_applied_learning_decisions (user_id, scenario_id);
create index if not exists user_competency_evidence_user_idx
  on public.user_competency_evidence (user_id, demonstrated_at desc);
create index if not exists user_competency_evidence_tag_idx
  on public.user_competency_evidence (user_id, competency_tag);
create index if not exists user_competency_evidence_track_level_idx
  on public.user_competency_evidence (user_id, track_code, level_code);

alter table public.user_applied_learning_decisions enable row level security;
alter table public.user_competency_evidence enable row level security;

create policy "service_role_all_applied_learning_decisions"
  on public.user_applied_learning_decisions
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service_role_all_competency_evidence"
  on public.user_competency_evidence
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "user_select_own_applied_learning_decisions"
  on public.user_applied_learning_decisions for select
  using (user_id = auth.uid()::text);
create policy "user_insert_own_applied_learning_decisions"
  on public.user_applied_learning_decisions for insert
  with check (user_id = auth.uid()::text);
create policy "user_update_own_applied_learning_decisions"
  on public.user_applied_learning_decisions for update
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
create policy "user_delete_own_applied_learning_decisions"
  on public.user_applied_learning_decisions for delete
  using (user_id = auth.uid()::text);

create policy "user_select_own_competency_evidence"
  on public.user_competency_evidence for select
  using (user_id = auth.uid()::text);
create policy "user_insert_own_competency_evidence"
  on public.user_competency_evidence for insert
  with check (user_id = auth.uid()::text);
create policy "user_update_own_competency_evidence"
  on public.user_competency_evidence for update
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
create policy "user_delete_own_competency_evidence"
  on public.user_competency_evidence for delete
  using (user_id = auth.uid()::text);

drop trigger if exists user_applied_learning_decisions_set_updated_at on public.user_applied_learning_decisions;
create trigger user_applied_learning_decisions_set_updated_at
  before update on public.user_applied_learning_decisions
  for each row execute function public.set_learning_progress_updated_at();

drop trigger if exists user_competency_evidence_set_updated_at on public.user_competency_evidence;
create trigger user_competency_evidence_set_updated_at
  before update on public.user_competency_evidence
  for each row execute function public.set_learning_progress_updated_at();
