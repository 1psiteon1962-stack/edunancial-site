create table if not exists public.business_tax_ledger (
  id uuid primary key default gen_random_uuid(),
  tax_type text not null check (tax_type in ('SALES_CONSUMPTION','INCOME','PAYROLL','FRANCHISE','PROPERTY','OTHER')),
  country_code text not null,
  jurisdiction_code text,
  period_start date not null,
  period_end date not null,
  currency text not null,
  tax_collected numeric(18,2) not null default 0,
  tax_accrued numeric(18,2) not null default 0,
  tax_remitted numeric(18,2) not null default 0,
  adjustments numeric(18,2) not null default 0,
  amount_due numeric(18,2) generated always as ((tax_collected + tax_accrued + adjustments) - tax_remitted) stored,
  filing_due_at timestamptz,
  filed_at timestamptz,
  remitted_at timestamptz,
  registration_account_ref text,
  rule_version text,
  source_system text,
  source_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_tax_ledger_due_idx on public.business_tax_ledger (filing_due_at, tax_type, country_code);
create index if not exists business_tax_ledger_period_idx on public.business_tax_ledger (period_start, period_end);
create unique index if not exists business_tax_ledger_source_unique_idx
  on public.business_tax_ledger (source_system, source_reference, tax_type)
  where source_system is not null and source_reference is not null;

alter table public.business_tax_ledger enable row level security;
revoke all on public.business_tax_ledger from anon, authenticated;

comment on table public.business_tax_ledger is 'Authoritative business tax liability ledger. Tracks collected/accrued/remitted taxes separately from revenue for executive reporting and diligence.';

create table if not exists public.executive_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_at timestamptz not null default now(),
  period_key text not null,
  metric_key text not null,
  metric_value numeric,
  metric_unit text not null,
  source_system text,
  source_reference text,
  status text not null default 'LIVE' check (status in ('LIVE','UNAVAILABLE','ESTIMATED')),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists executive_kpi_snapshots_lookup_idx on public.executive_kpi_snapshots (metric_key, period_key, snapshot_at desc);
alter table public.executive_kpi_snapshots enable row level security;
revoke all on public.executive_kpi_snapshots from anon, authenticated;

comment on table public.executive_kpi_snapshots is 'Historical executive KPI snapshots for trend reporting and VC/PE diligence reproducibility.';
