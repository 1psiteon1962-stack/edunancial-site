create table if not exists public.learning_credentials (
  id text primary key default gen_random_uuid()::text,
  credential_code text not null unique,
  user_id text not null,
  credential_type text not null check (credential_type in ('LEVEL','TRACK','BUSINESS_READINESS')),
  title text not null,
  track_code text check (track_code is null or track_code in ('RED','WHITE','BLUE','GOLD','ORANGE','BLACK','GREEN','PURPLE')),
  level_code text check (level_code is null or level_code in ('L1','L2','L3','L4','L5')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','REVOKED','EXPIRED')),
  evidence jsonb not null default '{}'::jsonb,
  competencies jsonb not null default '[]'::jsonb,
  issuer_name text not null default 'Edunancial',
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, credential_type, track_code, level_code)
);

comment on table public.learning_credentials is
  'Verifiable Edunancial credentials backed by learner completion, assessment, project, mentor, and business-readiness evidence.';

create index if not exists learning_credentials_user_idx on public.learning_credentials(user_id, issued_at desc);
create index if not exists learning_credentials_code_idx on public.learning_credentials(credential_code);
create index if not exists learning_credentials_status_idx on public.learning_credentials(status);

alter table public.learning_credentials enable row level security;

create policy "service_role_all_learning_credentials"
  on public.learning_credentials
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "user_select_own_learning_credentials"
  on public.learning_credentials
  for select
  using (user_id = auth.uid()::text);

create or replace function public.issue_level_completion_credentials()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  insert into public.learning_credentials (
    credential_code,
    user_id,
    credential_type,
    title,
    track_code,
    level_code,
    evidence,
    competencies
  )
  select
    'EDU-' || upper(substr(md5(p.user_id || ':' || p.track_code || ':' || p.level_code),1,12)),
    p.user_id,
    'LEVEL',
    'Edunancial ' || p.track_code || ' ' || p.level_code || ' Completion Credential',
    p.track_code,
    p.level_code,
    jsonb_build_object(
      'evidence_type','lesson_completion',
      'completed_lessons',count(*),
      'first_completed_at',min(p.completed_at),
      'last_completed_at',max(p.completed_at),
      'source','user_lesson_progress'
    ),
    jsonb_build_array(
      jsonb_build_object('name','curriculum_completion','status','demonstrated')
    )
  from public.user_lesson_progress p
  where p.status = 'completed'
    and p.completed_at is not null
  group by p.user_id, p.track_code, p.level_code
  having count(*) >= 50
  on conflict (user_id, credential_type, track_code, level_code) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

comment on function public.issue_level_completion_credentials() is
  'Issues first-generation Level credentials when 50 lessons in a track/level are completed. Future applied credentials should add assessment/project/mentor evidence rather than weakening this evidence model.';
