-- S8 closed-loop marketing diagnostics: targeting -> message -> handoff -> conversion -> retention.
create table if not exists marketing_funnel_events (
  id bigserial primary key,
  campaign_id uuid not null references marketing_campaigns(id) on delete cascade,
  content_id uuid references marketing_content(id) on delete set null,
  publication_id uuid references marketing_publications(id) on delete set null,
  stage text not null check (stage in ('targeting','message','handoff','conversion','retention')),
  event_type text not null,
  subject_key text,
  market text,
  locale text,
  platform text,
  value numeric,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists marketing_funnel_events_campaign_stage_idx on marketing_funnel_events(campaign_id,stage,occurred_at desc);

create table if not exists marketing_s8_diagnostics (
  id bigserial primary key,
  campaign_id uuid not null references marketing_campaigns(id) on delete cascade,
  window_starts_at timestamptz not null,
  window_ends_at timestamptz not null,
  diagnosed_stage text not null check (diagnosed_stage in ('targeting','message','handoff','conversion','retention','healthy','insufficient_data')),
  confidence numeric not null default 0 check (confidence>=0 and confidence<=1),
  evidence jsonb not null default '{}'::jsonb,
  recommended_action jsonb not null default '{}'::jsonb,
  action_status text not null default 'proposed' check (action_status in ('proposed','approved','executed','rejected','superseded')),
  created_at timestamptz not null default now()
);
create index if not exists marketing_s8_diagnostics_campaign_idx on marketing_s8_diagnostics(campaign_id,created_at desc);
