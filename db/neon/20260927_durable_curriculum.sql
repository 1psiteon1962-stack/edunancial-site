-- Durable global curriculum store.
-- Additive only: repository-backed curriculum remains authoritative until parity is proven.

create table if not exists curriculum_lessons (
  id uuid primary key default gen_random_uuid(),
  canonical_lesson_id text not null unique,
  track text not null,
  level integer not null check (level between 1 and 5),
  lesson_number integer not null check (lesson_number > 0),
  created_at timestamptz not null default now(),
  unique(track,level,lesson_number)
);

create table if not exists curriculum_revisions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references curriculum_lessons(id) on delete restrict,
  revision integer not null,
  source_revision_id uuid references curriculum_revisions(id) on delete restrict,
  status text not null default 'staged'
    check (status in ('staged','validated','approved','published','retired','rejected')),
  title text not null,
  summary text not null,
  body text not null,
  author text,
  source text,
  checksum text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz,
  unique(lesson_id,revision)
);

create table if not exists curriculum_localizations (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references curriculum_lessons(id) on delete restrict,
  locale text not null,
  revision integer not null,
  canonical_revision_id uuid not null references curriculum_revisions(id) on delete restrict,
  status text not null default 'staged'
    check (status in ('staged','validated','approved','published','retired','rejected')),
  title text not null,
  summary text not null,
  body text not null,
  checksum text not null,
  translation_provider text,
  translation_model text,
  quality jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz,
  unique(lesson_id,locale,revision),
  unique(id,lesson_id,locale)
);

create table if not exists curriculum_active_versions (
  lesson_id uuid not null references curriculum_lessons(id) on delete restrict,
  locale text not null,
  revision_id uuid not null,
  activated_at timestamptz not null default now(),
  activated_by text,
  primary key(lesson_id,locale),
  foreign key(revision_id,lesson_id,locale)
    references curriculum_localizations(id,lesson_id,locale) on delete restrict
);

create table if not exists curriculum_publish_batches (
  id uuid primary key default gen_random_uuid(),
  region_key text,
  status text not null default 'staged'
    check (status in ('staged','validating','validated','publishing','published','failed','rolled_back')),
  source_batch_ref text,
  expected_items integer not null default 0,
  published_items integer not null default 0,
  error_detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists curriculum_publish_batch_items (
  batch_id uuid not null references curriculum_publish_batches(id) on delete cascade,
  lesson_id uuid not null references curriculum_lessons(id) on delete restrict,
  locale text not null,
  revision_id uuid not null,
  status text not null default 'staged'
    check (status in ('staged','validated','published','failed','rolled_back')),
  prior_revision_id uuid,
  error_detail jsonb not null default '{}'::jsonb,
  primary key(batch_id,lesson_id,locale),
  foreign key(revision_id,lesson_id,locale)
    references curriculum_localizations(id,lesson_id,locale) on delete restrict
);

create index if not exists curriculum_revision_status_idx on curriculum_revisions(lesson_id,status);
create index if not exists curriculum_localization_status_idx on curriculum_localizations(lesson_id,locale,status);
create index if not exists curriculum_batch_status_idx on curriculum_publish_batches(status,created_at);
