-- Growth intelligence: auditable external signals + forecast snapshots.
-- Forecasts are decision support, not guarantees. Every output retains source provenance.

create table if not exists public.external_growth_signals (
  id bigint generated always as identity primary key,
  source_name text not null,
  source_series text not null,
  source_url text,
  geography_type text not null check (geography_type in ('country','region','global')),
  country_code text,
  region text,
  signal_date date not null,
  value numeric,
  unit text,
  direction text check (direction is null or direction in ('positive','neutral','negative')),
  freshness_days integer,
  metadata jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  unique(source_name,source_series,coalesce(country_code,''),coalesce(region,''),signal_date)
);
create index if not exists external_growth_signals_geo_idx on public.external_growth_signals(country_code,region,signal_date desc);
create index if not exists external_growth_signals_source_idx on public.external_growth_signals(source_name,source_series,signal_date desc);
alter table public.external_growth_signals enable row level security;
revoke all on public.external_growth_signals from anon, authenticated;
create policy "service_role_all_external_growth_signals" on public.external_growth_signals using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.growth_forecast_snapshots (
  id bigint generated always as identity primary key,
  forecast_date date not null default current_date,
  horizon_days integer not null check (horizon_days in (30,90,180,365)),
  dimension_type text not null check (dimension_type in ('global','region','country','age_band','gender','membership_tier','track','language','acquisition_source')),
  dimension_value text not null,
  internal_growth_score numeric not null check (internal_growth_score between -100 and 100),
  external_growth_score numeric not null check (external_growth_score between -100 and 100),
  combined_growth_score numeric not null check (combined_growth_score between -100 and 100),
  outlook text not null check (outlook in ('strong_growth','growth','stable','slowdown_risk','contraction_risk','insufficient_data')),
  confidence numeric not null check (confidence between 0 and 100),
  internal_observations integer not null default 0,
  external_observations integer not null default 0,
  drivers jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  source_refs jsonb not null default '[]'::jsonb,
  model_version text not null,
  generated_at timestamptz not null default now(),
  unique(forecast_date,horizon_days,dimension_type,dimension_value,model_version)
);
create index if not exists growth_forecast_snapshots_lookup_idx on public.growth_forecast_snapshots(dimension_type,dimension_value,forecast_date desc,horizon_days);
alter table public.growth_forecast_snapshots enable row level security;
revoke all on public.growth_forecast_snapshots from anon, authenticated;
create policy "service_role_all_growth_forecast_snapshots" on public.growth_forecast_snapshots using (auth.role()='service_role') with check (auth.role()='service_role');

create table if not exists public.growth_forecast_backtests (
  id bigint generated always as identity primary key,
  forecast_snapshot_id bigint not null references public.growth_forecast_snapshots(id) on delete cascade,
  evaluation_date date not null,
  actual_growth_percent numeric,
  predicted_direction text,
  actual_direction text,
  direction_correct boolean,
  absolute_error numeric,
  notes text,
  created_at timestamptz not null default now(),
  unique(forecast_snapshot_id,evaluation_date)
);
alter table public.growth_forecast_backtests enable row level security;
revoke all on public.growth_forecast_backtests from anon, authenticated;
create policy "service_role_all_growth_forecast_backtests" on public.growth_forecast_backtests using (auth.role()='service_role') with check (auth.role()='service_role');

comment on table public.external_growth_signals is 'Public macroeconomic, sentiment, demographic, connectivity, and demand signals used to cross-check Edunancial internal KPIs.';
comment on table public.growth_forecast_snapshots is 'Explainable forecast snapshots combining internal Edunancial KPIs with public external indicators. Never interpreted as guaranteed outcomes.';
comment on table public.growth_forecast_backtests is 'Tracks forecast accuracy over time so confidence can be calibrated using actual performance.';
