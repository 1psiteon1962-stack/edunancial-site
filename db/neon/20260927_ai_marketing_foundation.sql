-- Edunancial AI-first marketing foundation
-- Additive Neon schema. No social credentials are stored here.

create table if not exists marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  objective text not null,
  track text,
  market text not null default 'north-america',
  status text not null default 'draft' check (status in ('draft','review','approved','scheduled','active','paused','complete')),
  approval_required boolean not null default true,
  approved_at timestamptz,
  approved_by text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists marketing_content (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references marketing_campaigns(id) on delete cascade,
  source_type text not null default 'campaign',
  source_ref text,
  locale text not null default 'en-US',
  canonical_message text not null,
  status text not null default 'draft' check (status in ('draft','review','approved','rejected','scheduled','published','failed')),
  approved_at timestamptz,
  approved_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists marketing_publications (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references marketing_content(id) on delete cascade,
  platform text not null check (platform in ('linkedin','x','instagram','tiktok','youtube')),
  format text not null,
  platform_copy text not null,
  media_refs jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','review','approved','scheduled','publishing','published','failed','cancelled')),
  scheduled_for timestamptz,
  published_at timestamptz,
  provider text,
  provider_publication_id text,
  attempt_count integer not null default 0,
  last_error text,
  metrics jsonb not null default '{}'::jsonb,
  metrics_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(content_id, platform, format)
);

create index if not exists marketing_publications_due_idx
  on marketing_publications(status, scheduled_for)
  where status = 'scheduled';

create table if not exists marketing_approval_batches (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  status text not null default 'open' check (status in ('open','approved','rejected','closed')),
  window_starts_at timestamptz,
  window_ends_at timestamptz,
  approved_at timestamptz,
  approved_by text,
  created_at timestamptz not null default now()
);

create table if not exists marketing_approval_batch_items (
  batch_id uuid not null references marketing_approval_batches(id) on delete cascade,
  publication_id uuid not null references marketing_publications(id) on delete cascade,
  primary key(batch_id, publication_id)
);

create table if not exists marketing_publish_events (
  id bigserial primary key,
  publication_id uuid not null references marketing_publications(id) on delete cascade,
  event_type text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
