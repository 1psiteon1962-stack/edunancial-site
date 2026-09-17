-- Edunancial Video Maker: Neon migration foundation
-- PR A. Safe/idempotent schema alignment only; no Supabase cutover occurs here.
-- Persistent media belongs in object storage. Neon stores metadata/configuration only.

BEGIN;

ALTER TABLE IF EXISTS public.video_projects
  ADD COLUMN IF NOT EXISTS owner_key text,
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en-US';

ALTER TABLE IF EXISTS public.video_assets
  ADD COLUMN IF NOT EXISTS storage_provider text NOT NULL DEFAULT 'legacy',
  ADD COLUMN IF NOT EXISTS storage_key text,
  ADD COLUMN IF NOT EXISTS checksum_sha256 text,
  ADD COLUMN IF NOT EXISTS duration_ms bigint;

UPDATE public.video_assets
SET storage_key = storage_path
WHERE storage_key IS NULL AND storage_path IS NOT NULL;

ALTER TABLE IF EXISTS public.video_scenes
  ADD COLUMN IF NOT EXISTS animation_type text,
  ADD COLUMN IF NOT EXISTS animation_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS overlay_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS caption_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS transition_config jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE IF EXISTS public.video_audio_tracks
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'und',
  ADD COLUMN IF NOT EXISTS transcript text,
  ADD COLUMN IF NOT EXISTS translated_from_locale text,
  ADD COLUMN IF NOT EXISTS start_offset_ms bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration_ms bigint,
  ADD COLUMN IF NOT EXISTS loudness_lufs numeric;

ALTER TABLE IF EXISTS public.video_jobs
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'und',
  ADD COLUMN IF NOT EXISTS worker_id text,
  ADD COLUMN IF NOT EXISTS request_key text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS video_jobs_request_key_uidx
  ON public.video_jobs(request_key)
  WHERE request_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS video_jobs_queue_idx
  ON public.video_jobs(status, created_at);

CREATE INDEX IF NOT EXISTS video_assets_project_idx
  ON public.video_assets(project_id, created_at);

CREATE INDEX IF NOT EXISTS video_audio_tracks_project_idx
  ON public.video_audio_tracks(project_id, created_at);

CREATE INDEX IF NOT EXISTS video_worker_requests_created_idx
  ON public.video_worker_requests(created_at);

COMMIT;
