-- Neon KPI event store.
-- Mirrors the existing KPI event contract while moving runtime persistence off Supabase.

create table if not exists kpi_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  site_id text not null,
  site_region text not null,
  event_name text not null,
  user_id text null,
  session_id text null,
  ip_hash text null,
  user_agent text null,
  path text null,
  referrer text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  currency text null,
  value numeric null,
  sku text null,
  order_id text null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_kpi_events_created_at on kpi_events (created_at desc);
create index if not exists idx_kpi_events_site on kpi_events (site_id, site_region);
create index if not exists idx_kpi_events_event_name on kpi_events (event_name);
create index if not exists idx_kpi_events_path on kpi_events (path);
