-- Provider-neutral social account registry.
-- Stores identifiers and connection state only. OAuth secrets/tokens stay in the provider/secret store.
create table if not exists marketing_social_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('linkedin','facebook','x','instagram','tiktok','youtube')),
  provider text not null,
  provider_account_id text not null,
  display_name text not null,
  handle text,
  external_url text,
  connection_status text not null default 'pending'
    check (connection_status in ('pending','connected','reauthorization_required','disabled')),
  secret_ref text,
  capabilities jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform, provider, provider_account_id)
);

alter table marketing_publications
  add column if not exists social_account_id uuid references marketing_social_accounts(id) on delete set null;

create index if not exists marketing_social_accounts_status_idx
  on marketing_social_accounts(platform, connection_status);
