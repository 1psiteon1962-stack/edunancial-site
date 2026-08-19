create table if not exists public.country_launch_controls (
  country_code text primary key check (char_length(country_code) = 2),
  country_name text,
  region_code text,
  launch_state text not null default 'PRIVATE' check (launch_state in ('ACTIVE','PRIVATE','BETA','DISABLED')),
  reason text,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.country_launch_controls enable row level security;

revoke all on public.country_launch_controls from anon, authenticated;

comment on table public.country_launch_controls is 'Server-administered runtime country launch overrides. Service-role only; public clients must not write directly.';
