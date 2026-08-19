create table if not exists public.tax_runtime_rules (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  subdivision_code text,
  postal_prefix text,
  product_kind text not null,
  currency text not null,
  tax_type text not null default 'SALES_CONSUMPTION',
  rate_basis_points integer,
  taxable boolean,
  effective_from date not null,
  effective_to date,
  source_authority text not null,
  source_reference text not null,
  date_verified date not null,
  verification_status text not null check (verification_status in ('verified','stale','needs-review')),
  rule_version text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tax_runtime_rules_lookup_idx
  on public.tax_runtime_rules(country_code, subdivision_code, product_kind, effective_from, effective_to, verification_status);

create table if not exists public.tax_registrations (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  subdivision_code text,
  tax_type text not null default 'SALES_CONSUMPTION',
  registration_status text not null check (registration_status in ('not-required','monitoring','review','required','registered','suspended')),
  registration_account_ref text,
  effective_from date,
  effective_to date,
  filing_frequency text,
  next_filing_due_at timestamptz,
  next_payment_due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists tax_registrations_scope_unique_idx
  on public.tax_registrations(country_code, coalesce(subdivision_code, ''), tax_type);

create table if not exists public.tax_nexus_snapshots (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  subdivision_code text,
  period_start date not null,
  period_end date not null,
  currency text not null,
  taxable_sales_minor bigint not null default 0,
  transaction_count integer not null default 0,
  physical_nexus boolean not null default false,
  economic_nexus boolean not null default false,
  sales_threshold_minor bigint,
  transaction_threshold integer,
  threshold_currency text,
  registration_required boolean not null default false,
  threshold_status text not null default 'informational',
  rule_version_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tax_nexus_snapshots_lookup_idx
  on public.tax_nexus_snapshots(country_code, subdivision_code, period_end desc);

alter table public.tax_runtime_rules enable row level security;
alter table public.tax_registrations enable row level security;
alter table public.tax_nexus_snapshots enable row level security;
revoke all on public.tax_runtime_rules from anon, authenticated;
revoke all on public.tax_registrations from anon, authenticated;
revoke all on public.tax_nexus_snapshots from anon, authenticated;

comment on table public.tax_runtime_rules is 'Data-driven, versioned tax rules. Only verified rules may be used for automatic collection.';
comment on table public.tax_registrations is 'Jurisdiction-level tax registration and filing configuration.';
comment on table public.tax_nexus_snapshots is 'Historical nexus and threshold snapshots used for collection decisions and executive tax reporting.';
