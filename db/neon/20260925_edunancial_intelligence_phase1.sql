-- Phase 1 Edunancial Intelligence Layer.
-- Additive only: no curriculum tables or canonical lesson IDs are modified.

create table if not exists learner_ai_preferences (
  user_id text primary key,
  country_code text,
  jurisdiction_code text,
  preferred_language text not null default 'en',
  learning_goals jsonb not null default '[]'::jsonb,
  ai_assistance_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists learner_events (
  id bigserial primary key,
  user_id text,
  event_name text not null,
  lesson_id text,
  track text,
  level integer,
  locale text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists learner_events_user_time_idx on learner_events (user_id, occurred_at desc);
create index if not exists learner_events_name_time_idx on learner_events (event_name, occurred_at desc);

create table if not exists ai_learning_interactions (
  id bigserial primary key,
  user_id text,
  lesson_id text,
  track text,
  level integer,
  locale text,
  jurisdiction_code text,
  intent text not null,
  prompt_length integer not null default 0,
  enabled boolean not null default false,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists ai_learning_interactions_user_time_idx on ai_learning_interactions (user_id, created_at desc);
