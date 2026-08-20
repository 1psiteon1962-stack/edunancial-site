create extension if not exists pgcrypto;

create table if not exists public.video_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  created_by text not null,
  status text not null default 'draft' check (status in ('draft','uploaded','processing','master_ready','failed')),
  edit_recipe jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  asset_type text not null check (asset_type in ('RAW_VIDEO','EDITED_MASTER')),
  storage_bucket text not null check (storage_bucket in ('raw-videos','processed-videos')),
  storage_path text not null,
  original_filename text,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  source_asset_id uuid references public.video_assets(id) on delete set null,
  output_asset_id uuid references public.video_assets(id) on delete set null,
  stage text not null default 'RENDER_MASTER' check (stage = 'RENDER_MASTER'),
  status text not null default 'queued' check (status in ('queued','processing','succeeded','failed')),
  edit_recipe jsonb not null default '{}'::jsonb,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, stage)
);

create table if not exists public.video_worker_requests (
  request_id uuid primary key,
  job_id uuid not null references public.video_jobs(id) on delete cascade,
  received_at timestamptz not null default now()
);

create index if not exists video_assets_project_id_idx on public.video_assets(project_id);
create index if not exists video_jobs_project_status_idx on public.video_jobs(project_id, status);

alter table public.video_projects enable row level security;
alter table public.video_assets enable row level security;
alter table public.video_jobs enable row level security;
alter table public.video_worker_requests enable row level security;

revoke all on public.video_projects from anon, authenticated;
revoke all on public.video_assets from anon, authenticated;
revoke all on public.video_jobs from anon, authenticated;
revoke all on public.video_worker_requests from anon, authenticated;

insert into storage.buckets (id, name, public)
values ('raw-videos', 'raw-videos', false), ('processed-videos', 'processed-videos', false)
on conflict (id) do update set public = false;
