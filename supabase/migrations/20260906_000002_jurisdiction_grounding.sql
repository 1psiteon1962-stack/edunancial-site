-- Durable regulatory truth store for the Edunancial jurisdiction engine.
-- AI output is never itself authoritative; rules must point to official sources.

create table if not exists public.jurisdiction_authority_sources (
  id text primary key,
  jurisdiction text not null,
  authority text not null,
  title text not null,
  url text not null,
  source_type text not null check (source_type in ('legislation','tax-authority','regulator','court','official-guidance')),
  effective_from date,
  effective_to date,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jurisdiction_rules (
  id text primary key,
  jurisdiction text not null,
  subdivision_code text,
  topics text[] not null default '{}',
  statement text not null,
  source_ids text[] not null default '{}',
  effective_from date,
  effective_to date,
  risk text not null check (risk in ('green','yellow','red')),
  verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','stale','conflict')),
  confidence double precision not null default 0 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jurisdiction_rules_lookup_idx on public.jurisdiction_rules (jurisdiction, subdivision_code);
create index if not exists jurisdiction_rules_topics_idx on public.jurisdiction_rules using gin (topics);
create index if not exists jurisdiction_authority_sources_jurisdiction_idx on public.jurisdiction_authority_sources (jurisdiction);

alter table public.jurisdiction_rules enable row level security;
alter table public.jurisdiction_authority_sources enable row level security;

-- These tables are intentionally not directly readable/writable by learners.
-- Production access is server-side through the jurisdiction repository boundary.
comment on table public.jurisdiction_rules is 'Verified/effective-dated jurisdiction rules used to ground Edunancial educational localization.';
comment on table public.jurisdiction_authority_sources is 'Official authority sources supporting jurisdiction rules; model output is not a source of regulatory truth.';
