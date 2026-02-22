-- Creates a capital-grade KPI event store with site-level tagging.
-- Safe to run once.

create table if not exists public.kpi_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),

  -- Multi-site tagging
  site_id text not null,
  site_region text not null,

  -- Standardized event name
  event_name text not null,

  -- Optional user/session identifiers
  user_id text null,
  session_id text null,

  -- Request context (privacy-safe)
  ip_hash text null,
  user_agent text null,

  -- URL / referrer
  path text null,
  referrer text null,

  -- UTM attribution
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,

  -- Commerce fields (if known at event time)
  currency text null,
  value numeric null,
  sku text null,
  order_id text null,

  -- Flexible metadata (json)
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_kpi_events_created_at on public.kpi_events (created_at desc);
create index if not exists idx_kpi_events_site on public.kpi_events (site_id, site_region);
create index if not exists idx_kpi_events_event_name on public.kpi_events (event_name);
create index if not exists idx_kpi_events_path on public.kpi_events (path);

-- Optional: basic row-level safety for queries that filter by site.
-- You can add RLS later; service role key bypasses RLS.
