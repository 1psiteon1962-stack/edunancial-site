create table if not exists public.executive_kpi_targets (
  metric_key text primary key,
  label text not null,
  target_value numeric,
  unit text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.executive_kpi_targets enable row level security;
revoke all on public.executive_kpi_targets from anon, authenticated;
create policy "service_role_all_executive_kpi_targets"
  on public.executive_kpi_targets
  using (auth.role()='service_role')
  with check (auth.role()='service_role');

comment on table public.executive_kpi_targets is 'Owner-defined KPI targets. No arbitrary target values are seeded by migration.';
