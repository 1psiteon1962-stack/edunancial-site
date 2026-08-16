-- Marketing spend is stored separately from behavioral events so CAC/ROAS
-- can be calculated from actual spend and actual acquired customers.
create table if not exists public.kpi_marketing_spend (
  id bigserial primary key,
  spend_date date not null,
  channel text not null,
  campaign text null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  notes text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_kpi_marketing_spend_date
  on public.kpi_marketing_spend (spend_date desc);
create index if not exists idx_kpi_marketing_spend_channel
  on public.kpi_marketing_spend (channel);

alter table public.kpi_marketing_spend enable row level security;
-- No public policies by design. Executive server queries use the service role.
