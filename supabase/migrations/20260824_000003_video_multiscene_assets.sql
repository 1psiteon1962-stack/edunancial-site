alter table public.video_assets drop constraint if exists video_assets_asset_type_check;
alter table public.video_assets
  add constraint video_assets_asset_type_check
  check (asset_type in ('RAW_VIDEO','RAW_IMAGE','RAW_AUDIO','NARRATION_AUDIO','MUSIC_AUDIO','EDITED_MASTER'));

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

create table if not exists public.video_voice_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  provider text not null,
  provider_voice_id text,
  consent_confirmed boolean not null default false,
  consent_confirmed_at timestamptz,
  source_asset_id uuid references public.video_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_audio_tracks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  asset_id uuid references public.video_assets(id) on delete set null,
  track_type text not null check (track_type in ('ORIGINAL_NARRATION','TRANSLATED_NARRATION','BACKGROUND_MUSIC')),
  locale text not null default 'en-US',
  transcript text,
  translated_from_locale text,
  voice_profile_id uuid references public.video_voice_profiles(id) on delete set null,
  volume numeric(4,3) not null default 1.0 check (volume between 0 and 2),
  muted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists video_scenes_project_order_idx on public.video_scenes(project_id, scene_order);
create index if not exists video_audio_tracks_project_idx on public.video_audio_tracks(project_id, track_type, locale);
alter table public.video_scenes enable row level security;
alter table public.video_voice_profiles enable row level security;
alter table public.video_audio_tracks enable row level security;
revoke all on public.video_scenes from anon, authenticated;
revoke all on public.video_voice_profiles from anon, authenticated;
revoke all on public.video_audio_tracks from anon, authenticated;
