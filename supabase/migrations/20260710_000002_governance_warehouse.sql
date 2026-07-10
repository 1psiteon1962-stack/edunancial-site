-- =============================================================================
-- Edunancial Data Governance & Warehouse Preparation
-- Migration: 20260710_000002_governance_warehouse
-- =============================================================================

-- ---------------------------------------------------------------------------
-- DATA CATALOG
-- ---------------------------------------------------------------------------

create table if not exists public.data_catalog (
  id                  uuid primary key default uuid_generate_v4(),
  entity_type         text not null,                          -- Table / domain name
  entity_name         text not null,
  friendly_name       text not null,
  description         text,
  owner_team          text not null,
  owner_email         text,
  steward_email       text,
  data_classification public.data_classification not null,
  pii_contains        boolean not null default false,
  pii_fields          text[],
  sensitive_fields    text[],
  retention_days      integer,
  legal_basis         text,                                   -- GDPR legal basis
  source_systems      text[],
  downstream_systems  text[],
  refresh_frequency   text,
  schema_version      text not null default '1.0',
  tags                text[],
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  metadata            jsonb not null default '{}'::jsonb,
  unique (entity_type, entity_name)
);

-- ---------------------------------------------------------------------------
-- DATA QUALITY RULES
-- ---------------------------------------------------------------------------

create table if not exists public.data_quality_rules (
  id                uuid primary key default uuid_generate_v4(),
  rule_name         text unique not null,
  entity_type       text not null,
  field_name        text,
  rule_type         text not null,                            -- not_null, unique, format, range, referential, custom
  rule_expression   text not null,
  severity          text not null default 'warning',          -- info, warning, error, critical
  description       text,
  remediation       text,
  is_active         boolean not null default true,
  last_run_at       timestamptz,
  last_pass_count   integer,
  last_fail_count   integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

-- Data Quality Violations Log
create table if not exists public.data_quality_violations (
  id              bigserial primary key,
  rule_id         uuid not null references public.data_quality_rules(id) on delete cascade,
  entity_type     text not null,
  entity_id       text not null,
  field_name      text,
  field_value     text,
  violation_detail text,
  detected_at     timestamptz not null default now(),
  resolved_at     timestamptz,
  resolved_by     uuid,
  status          text not null default 'open',               -- open, resolved, ignored
  metadata        jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- DATA LINEAGE
-- ---------------------------------------------------------------------------

create table if not exists public.data_lineage (
  id                uuid primary key default uuid_generate_v4(),
  source_entity     text not null,
  source_field      text,
  target_entity     text not null,
  target_field      text,
  transformation    text,
  pipeline_name     text,
  pipeline_version  text,
  direction         text not null default 'downstream',       -- upstream, downstream
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- DATA LIFECYCLE MANAGEMENT
-- ---------------------------------------------------------------------------

create table if not exists public.retention_policies (
  id                    uuid primary key default uuid_generate_v4(),
  policy_name           text unique not null,
  entity_type           text not null unique,
  active_retention_days integer not null,
  archive_retention_days integer,
  deletion_after_archive_days integer,
  legal_hold_supported  boolean not null default false,
  gdpr_applies          boolean not null default true,
  ccpa_applies          boolean not null default true,
  region_overrides      jsonb not null default '{}'::jsonb,   -- Per-region retention overrides
  description           text,
  legal_basis           text,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  metadata              jsonb not null default '{}'::jsonb
);

-- Legal Holds
create table if not exists public.legal_holds (
  id                uuid primary key default uuid_generate_v4(),
  hold_name         text unique not null,
  description       text,
  entity_type       text not null,
  entity_ids        text[],                                   -- Specific entity IDs under hold
  scope_query       text,                                     -- SQL/filter for broad holds
  reason            text not null,
  legal_case_ref    text,
  placed_by         uuid references public.admin_users(id) on delete set null,
  placed_at         timestamptz not null default now(),
  expires_at        timestamptz,
  released_at       timestamptz,
  released_by       uuid references public.admin_users(id) on delete set null,
  status            text not null default 'active',           -- active, released, expired
  region            public.region_code,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  metadata          jsonb not null default '{}'::jsonb
);

-- Archive Log
create table if not exists public.archive_log (
  id              bigserial primary key,
  entity_type     text not null,
  entity_id       text not null,
  archived_data   jsonb not null,
  archived_at     timestamptz not null default now(),
  archived_by     text,
  archive_reason  text,
  retention_until timestamptz,
  purge_at        timestamptz,
  purged_at       timestamptz,
  region          public.region_code,
  metadata        jsonb not null default '{}'::jsonb
);

create index if not exists idx_archive_entity on public.archive_log (entity_type, entity_id);
create index if not exists idx_archive_purge on public.archive_log (purge_at) where purged_at is null;

-- ---------------------------------------------------------------------------
-- ANALYTICS / WAREHOUSE LAYER
-- ---------------------------------------------------------------------------

-- Materialized aggregate: daily member stats per region
create table if not exists public.analytics_member_daily (
  id                  bigserial primary key,
  report_date         date not null,
  region              text not null,
  new_registrations   integer not null default 0,
  active_members      integer not null default 0,
  churned_members     integer not null default 0,
  tier_free           integer not null default 0,
  tier_starter        integer not null default 0,
  tier_professional   integer not null default 0,
  tier_enterprise     integer not null default 0,
  tier_lifetime       integer not null default 0,
  computed_at         timestamptz not null default now(),
  unique (report_date, region)
);

-- Materialized aggregate: daily revenue
create table if not exists public.analytics_revenue_daily (
  id                  bigserial primary key,
  report_date         date not null,
  region              text not null,
  currency            text not null default 'USD',
  gross_revenue       numeric(16,4) not null default 0,
  net_revenue         numeric(16,4) not null default 0,
  refunds             numeric(16,4) not null default 0,
  transaction_count   integer not null default 0,
  new_subscriptions   integer not null default 0,
  renewals            integer not null default 0,
  cancellations       integer not null default 0,
  computed_at         timestamptz not null default now(),
  unique (report_date, region, currency)
);

-- Materialized aggregate: course engagement
create table if not exists public.analytics_course_daily (
  id                  bigserial primary key,
  report_date         date not null,
  course_id           uuid not null,
  new_enrollments     integer not null default 0,
  completions         integer not null default 0,
  active_learners     integer not null default 0,
  avg_progress_pct    numeric(5,2),
  total_watch_time_s  bigint not null default 0,
  certificates_issued integer not null default 0,
  computed_at         timestamptz not null default now(),
  unique (report_date, course_id)
);

-- BI event pipeline (raw events for warehouse ingestion)
create table if not exists public.warehouse_events (
  id              bigserial primary key,
  event_id        uuid unique not null default uuid_generate_v4(),
  event_name      text not null,
  event_version   text not null default '1.0',
  source_entity   text not null,
  source_id       text not null,
  actor_id        uuid,
  region          text,
  payload         jsonb not null default '{}'::jsonb,
  ingested_at     timestamptz not null default now(),
  processed_at    timestamptz,
  is_processed    boolean not null default false,
  batch_id        uuid,
  metadata        jsonb not null default '{}'::jsonb
);

create index if not exists idx_warehouse_events_unprocessed
  on public.warehouse_events (ingested_at)
  where is_processed = false;

create index if not exists idx_warehouse_events_name on public.warehouse_events (event_name, ingested_at desc);

-- AI training dataset snapshots registry
create table if not exists public.ai_dataset_registry (
  id                  uuid primary key default uuid_generate_v4(),
  dataset_name        text unique not null,
  description         text,
  version             text not null,
  entity_types        text[],
  record_count        bigint,
  size_bytes          bigint,
  training_purpose    text,                                   -- recommendation, prediction, nlp, etc.
  privacy_compliant   boolean not null default false,
  anonymized          boolean not null default false,
  anonymization_method text,
  region_scope        text[],
  created_at          timestamptz not null default now(),
  exported_at         timestamptz,
  expires_at          timestamptz,
  created_by          uuid references public.admin_users(id) on delete set null,
  approved_by         uuid references public.admin_users(id) on delete set null,
  approved_at         timestamptz,
  status              text not null default 'pending',        -- pending, approved, exported, archived
  storage_location    text,
  metadata            jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- MASTER DATA MANAGEMENT
-- ---------------------------------------------------------------------------

create table if not exists public.master_data_domains (
  id            uuid primary key default uuid_generate_v4(),
  domain_name   text unique not null,                         -- e.g., country, currency, category
  description   text,
  owner_team    text,
  record_count  integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.master_data_values (
  id            uuid primary key default uuid_generate_v4(),
  domain_id     uuid not null references public.master_data_domains(id) on delete cascade,
  code          text not null,
  value         text not null,
  description   text,
  parent_code   text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  valid_from    date,
  valid_to      date,
  regional_labels jsonb not null default '{}'::jsonb,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (domain_id, code)
);

-- ---------------------------------------------------------------------------
-- BACKUP REGISTRY
-- ---------------------------------------------------------------------------

create table if not exists public.backup_registry (
  id              uuid primary key default uuid_generate_v4(),
  backup_type     text not null,                              -- full, incremental, differential
  scope           text not null,                              -- database, table, files
  scope_detail    text,
  status          text not null default 'pending',            -- pending, running, completed, failed, verified
  started_at      timestamptz,
  completed_at    timestamptz,
  verified_at     timestamptz,
  size_bytes      bigint,
  storage_location text,
  encryption_key_ref text,
  retention_until timestamptz,
  region          public.region_code,
  initiated_by    text,
  error_message   text,
  created_at      timestamptz not null default now(),
  metadata        jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- SYSTEM SETTINGS (Runtime configuration)
-- ---------------------------------------------------------------------------

create table if not exists public.platform_settings (
  id          uuid primary key default uuid_generate_v4(),
  scope       text not null,                                  -- global, region, feature
  scope_key   text not null,
  key         text not null,
  value       jsonb not null,
  description text,
  is_secret   boolean not null default false,
  updated_by  uuid,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  metadata    jsonb not null default '{}'::jsonb,
  unique (scope, scope_key, key)
);

-- ---------------------------------------------------------------------------
-- SEED: DEFAULT RETENTION POLICIES
-- ---------------------------------------------------------------------------

insert into public.retention_policies (policy_name, entity_type, active_retention_days, archive_retention_days, deletion_after_archive_days, gdpr_applies, ccpa_applies, description)
values
  ('Members Active Retention', 'members', 3650, 365, 90, true, true, 'Active member records retained 10 years'),
  ('Payment Records', 'payments', 2555, 1825, 180, true, true, 'Payment records retained 7 years for financial compliance'),
  ('Audit Logs', 'audit_logs', 2555, 3650, null, true, true, 'Audit logs retained 7 years minimum, archived 10 years'),
  ('Course Enrollments', 'course_enrollments', 1825, 365, 180, true, true, 'Enrollment records retained 5 years'),
  ('AI Interactions', 'ai_interactions', 365, 180, 90, true, true, 'AI interaction data retained 1 year then archived'),
  ('Support Tickets', 'support_tickets', 1095, 365, 90, true, true, 'Support tickets retained 3 years'),
  ('Calculator Sessions', 'calculator_sessions', 90, 30, 30, true, true, 'Calculator sessions retained 90 days'),
  ('Notifications', 'notifications', 180, 90, 90, true, true, 'Notification records retained 6 months')
on conflict do nothing;

-- Seed default master data domains
insert into public.master_data_domains (domain_name, description, owner_team)
values
  ('country', 'ISO 3166-1 country codes and names', 'platform'),
  ('currency', 'ISO 4217 currency codes', 'platform'),
  ('language', 'BCP 47 language tags', 'platform'),
  ('region', 'Edunancial regional segments', 'platform'),
  ('membership_tier', 'Membership product tiers', 'product'),
  ('course_category', 'Course taxonomy categories', 'content'),
  ('payment_provider', 'Payment gateway providers', 'payments')
on conflict do nothing;
