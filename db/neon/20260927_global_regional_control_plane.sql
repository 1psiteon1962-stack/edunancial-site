-- Global regional control plane: build globally, activate regionally.
-- Region failures are isolated; a disabled/degraded region must not mutate another region.
create table if not exists global_regions (
  key text primary key,
  display_name text not null,
  activation_status text not null default 'inactive'
    check (activation_status in ('inactive','pilot','active','paused')),
  health_status text not null default 'healthy'
    check (health_status in ('healthy','degraded','unavailable')),
  config_version integer not null default 1,
  config jsonb not null default '{}'::jsonb,
  last_health_change_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into global_regions(key,display_name,activation_status) values
 ('north-america','North America','active'),
 ('latin-america','Latin America','inactive'),
 ('caribbean','Caribbean','inactive'),
 ('europe','Europe','inactive'),
 ('africa','Africa','inactive'),
 ('middle-east','Middle East','inactive'),
 ('asia-pacific','Asia Pacific','inactive')
on conflict(key) do nothing;

create table if not exists regional_service_health (
  region_key text not null references global_regions(key) on delete cascade,
  service_key text not null,
  status text not null default 'healthy'
    check (status in ('healthy','degraded','unavailable')),
  circuit_open boolean not null default false,
  failure_count integer not null default 0,
  last_failure_at timestamptz,
  last_success_at timestamptz,
  detail jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(region_key,service_key)
);

create table if not exists regional_config_versions (
  id bigserial primary key,
  region_key text not null references global_regions(key) on delete cascade,
  version integer not null,
  config jsonb not null,
  status text not null default 'draft' check (status in ('draft','validated','active','retired','rejected')),
  created_by text,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  unique(region_key,version)
);

create index if not exists regional_service_health_circuit_idx
 on regional_service_health(region_key,circuit_open);
