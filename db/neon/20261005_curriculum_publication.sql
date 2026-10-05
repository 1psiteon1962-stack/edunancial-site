create table if not exists curriculum_publication_leases (
  lease_key text primary key,
  owner text not null,
  purpose text not null,
  fencing_token bigint not null default 1,
  acquired_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists curriculum_uploads (
  upload_id text primary key,
  original_batch_id text not null,
  storage_path text not null,
  original_filename text not null,
  coordinate text,
  content_sha256 text,
  state text not null check (state in ('STORED','FINALIZING','STORED_FOR_REVIEW','PUBLISHED','FAILED')),
  attempts integer not null default 0,
  review_batch_id text,
  retryable boolean not null default true,
  last_error text,
  learner_verified boolean not null default false,
  verification jsonb,
  github_export_state text not null default 'NOT_REQUIRED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists curriculum_upload_events (
  id bigserial primary key,
  upload_id text not null references curriculum_uploads(upload_id) on delete cascade,
  event_type text not null,
  detail jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists curriculum_upload_events_upload_idx on curriculum_upload_events(upload_id, occurred_at desc);

create table if not exists published_lessons (
  lesson_id text primary key,
  track text not null,
  track_name text not null,
  level integer not null check (level between 1 and 5),
  lesson_number integer not null check (lesson_number between 1 and 50),
  title text not null,
  summary text not null default '',
  body text not null,
  author text,
  lesson_date text,
  version text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  content_sha256 text not null,
  source_upload_id text,
  updated_at timestamptz not null default now(),
  unique(track, level, lesson_number)
);

create table if not exists published_translations (
  lesson_id text not null references published_lessons(lesson_id) on delete cascade,
  locale text not null,
  title text not null,
  summary text not null default '',
  body text not null,
  content_sha256 text not null,
  source_upload_id text,
  updated_at timestamptz not null default now(),
  primary key(lesson_id, locale)
);

create table if not exists lesson_versions (
  id bigserial primary key,
  lesson_id text not null,
  locale text not null,
  content_sha256 text not null,
  payload jsonb not null,
  source_upload_id text,
  published_at timestamptz not null default now(),
  unique(lesson_id, locale, content_sha256)
);

create table if not exists curriculum_git_export_queue (
  upload_id text primary key,
  state text not null default 'PENDING',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  branch text,
  pull_request_url text,
  last_error text,
  updated_at timestamptz not null default now()
);
create index if not exists curriculum_git_export_due_idx on curriculum_git_export_queue(state, next_attempt_at);
