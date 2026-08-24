alter table public.video_assets drop constraint if exists video_assets_asset_type_check;
alter table public.video_assets
  add constraint video_assets_asset_type_check
  check (asset_type in ('RAW_VIDEO','RAW_IMAGE','EDITED_MASTER'));

create table if not exists public.video_scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  asset_id uuid not null references public.video_assets(id) on delete cascade,
  scene_order integer not null check (scene_order >= 0),
  duration_seconds numeric(6,2) not null default 6 check (duration_seconds between 1 and 60),
  overlay_text text,
  fit_mode text not null default 'contain' check (fit_mode in ('contain','cover')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, scene_order)
);

create index if not exists video_scenes_project_order_idx on public.video_scenes(project_id, scene_order);
alter table public.video_scenes enable row level security;
revoke all on public.video_scenes from anon, authenticated;
