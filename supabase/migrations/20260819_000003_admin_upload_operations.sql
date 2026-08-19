create table if not exists public.admin_upload_operations (
  id uuid primary key default gen_random_uuid(),
  batch_id text,
  upload_id text,
  phase text not null check (phase in ('PRESIGN','TRANSFER','FINALIZE','LEGACY_UPLOAD','PUBLISH','VERIFY')),
  status text not null check (status in ('STARTED','SUCCEEDED','FAILED','FALLBACK')),
  storage_path text,
  file_name text,
  file_size bigint,
  error_code text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_upload_operations_batch_idx on public.admin_upload_operations(batch_id, created_at desc);
create index if not exists admin_upload_operations_status_idx on public.admin_upload_operations(status, created_at desc);
create index if not exists admin_upload_operations_phase_idx on public.admin_upload_operations(phase, created_at desc);

alter table public.admin_upload_operations enable row level security;
revoke all on public.admin_upload_operations from anon, authenticated;

comment on table public.admin_upload_operations is 'Service-role operational audit trail for admin content upload pipeline phases, failures, and fallbacks.';
