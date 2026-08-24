-- Edunancial R1 backend video processing queue.
create extension if not exists pgcrypto;

create table if not exists public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  raw_bucket text not null default 'raw-videos',
  raw_path text not null,
  processed_bucket text not null default 'processed-videos',
  processed_path text,
  trim_start_seconds numeric not null default 0 check (trim_start_seconds >= 0),
  trim_end_seconds numeric check (trim_end_seconds is null or trim_end_seconds > trim_start_seconds),
  music_path text,
  music_volume numeric not null default 0.15 check (music_volume >= 0 and music_volume <= 1),
  error_message text,
  started_at timestamptz,
  completed_at timestamptz
);

create index if not exists video_jobs_status_created_at_idx
  on public.video_jobs (status, created_at);

alter table public.video_jobs enable row level security;

-- R1 intentionally exposes no browser/client policies. The Next.js admin API and
-- external worker use the Supabase service-role credential on trusted servers only.

create or replace function public.set_video_jobs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists video_jobs_set_updated_at on public.video_jobs;
create trigger video_jobs_set_updated_at
before update on public.video_jobs
for each row execute function public.set_video_jobs_updated_at();
