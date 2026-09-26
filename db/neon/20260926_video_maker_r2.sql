-- Edunancial Video Maker R2: clean Neon-native foundation.
-- Metadata and queue state live in Neon. Media bytes live in object storage.
-- This migration is intentionally independent of the legacy Supabase video schema.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.video_r2_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  owner_email text NOT NULL,
  purpose text NOT NULL DEFAULT 'marketing' CHECK (purpose IN ('marketing','lesson')),
  track text CHECK (track IN ('RED','WHITE','BLUE','GREEN','GOLD','PURPLE','ORANGE','BLACK')),
  level smallint CHECK (level BETWEEN 1 AND 5),
  lesson_number smallint CHECK (lesson_number BETWEEN 1 AND 999),
  lesson_id text GENERATED ALWAYS AS (
    CASE WHEN track IS NOT NULL THEN track || '-L' || level || '-' || lpad(lesson_number::text, 3, '0') END
  ) STORED,
  default_locale text NOT NULL DEFAULT 'en-US',
  output_profile text NOT NULL DEFAULT 'vertical_1080x1920'
    CHECK (output_profile IN ('vertical_1080x1920','landscape_1920x1080','square_1080x1080')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((purpose = 'lesson') = (track IS NOT NULL AND level IS NOT NULL AND lesson_number IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS video_r2_projects_lesson_idx ON public.video_r2_projects (lesson_id) WHERE lesson_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.video_r2_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.video_r2_projects(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('source_video','source_image','narration','music','master','thumbnail')),
  storage_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending_upload' CHECK (status IN ('pending_upload','ready','failed','deleted')),
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size > 0),
  checksum_sha256 text,
  locale text,
  width int,
  height int,
  duration_ms bigint,
  original_filename text,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);
CREATE INDEX IF NOT EXISTS video_r2_assets_project_idx ON public.video_r2_assets (project_id, kind);

CREATE TABLE IF NOT EXISTS public.video_r2_scenes (
  project_id uuid NOT NULL REFERENCES public.video_r2_projects(id) ON DELETE CASCADE,
  scene_order int NOT NULL CHECK (scene_order >= 0),
  asset_id uuid NOT NULL REFERENCES public.video_r2_assets(id),
  duration_seconds numeric(6,2) NOT NULL CHECK (duration_seconds BETWEEN 1 AND 60),
  fit_mode text NOT NULL DEFAULT 'contain' CHECK (fit_mode IN ('contain','cover')),
  overlay_text jsonb NOT NULL DEFAULT '{}'::jsonb,
  transition_type text NOT NULL DEFAULT 'cut'
    CHECK (transition_type IN ('cut','fade','wipeleft','wiperight','slideleft','slideright')),
  transition_seconds numeric(4,2) NOT NULL DEFAULT 0.35 CHECK (transition_seconds BETWEEN 0.10 AND 2.00),
  PRIMARY KEY (project_id, scene_order)
);

CREATE TABLE IF NOT EXISTS public.video_r2_audio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.video_r2_projects(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('narration','music')),
  locale text NOT NULL DEFAULT 'und',
  asset_id uuid NOT NULL REFERENCES public.video_r2_assets(id),
  transcript text,
  source_locale text,
  volume numeric(4,3) NOT NULL DEFAULT 1.0 CHECK (volume BETWEEN 0 AND 2),
  UNIQUE (project_id, role, locale)
);

CREATE TABLE IF NOT EXISTS public.video_r2_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.video_r2_projects(id) ON DELETE CASCADE,
  locale text NOT NULL,
  output_profile text NOT NULL CHECK (output_profile IN ('vertical_1080x1920','landscape_1920x1080','square_1080x1080')),
  composition jsonb NOT NULL,
  composition_hash text NOT NULL,
  idempotency_key text UNIQUE,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','succeeded','failed','cancelled')),
  attempt_count int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 10),
  not_before timestamptz NOT NULL DEFAULT now(),
  lease_owner text,
  lease_token uuid,
  lease_expires_at timestamptz,
  output_asset_id uuid REFERENCES public.video_r2_assets(id),
  error_code text,
  last_error text,
  created_by text NOT NULL,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS video_r2_jobs_one_active
  ON public.video_r2_jobs (project_id, locale) WHERE status IN ('queued','processing');
CREATE INDEX IF NOT EXISTS video_r2_jobs_claimable
  ON public.video_r2_jobs (not_before, queued_at) WHERE status IN ('queued','processing');

CREATE OR REPLACE FUNCTION public.video_r2_claim_job(p_job uuid, p_worker text)
RETURNS SETOF public.video_r2_jobs
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE video_r2_jobs
  SET status='failed', error_code='attempts_exhausted',
      last_error=coalesce(last_error,'Maximum render attempts exhausted.'), finished_at=now(),
      lease_owner=NULL, lease_token=NULL, lease_expires_at=NULL
  WHERE status='processing' AND lease_expires_at < now() AND attempt_count >= max_attempts;

  RETURN QUERY
  UPDATE video_r2_jobs j SET
    status='processing', lease_owner=p_worker, lease_token=gen_random_uuid(),
    lease_expires_at=now()+interval '5 minutes', attempt_count=j.attempt_count+1,
    started_at=coalesce(j.started_at,now()), last_error=NULL, error_code=NULL
  WHERE j.id=(
    SELECT q.id FROM video_r2_jobs q
    WHERE (p_job IS NULL OR q.id=p_job) AND q.attempt_count < q.max_attempts
      AND q.not_before <= now()
      AND (q.status='queued' OR (q.status='processing' AND q.lease_expires_at < now()))
    ORDER BY q.queued_at FOR UPDATE SKIP LOCKED LIMIT 1
  )
  RETURNING j.*;
END $$;

CREATE OR REPLACE FUNCTION public.video_r2_heartbeat(p_job uuid, p_token uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE video_r2_jobs SET lease_expires_at=now()+interval '5 minutes'
  WHERE id=p_job AND status='processing' AND lease_token=p_token AND lease_expires_at >= now()
  RETURNING true;
$$;

CREATE OR REPLACE FUNCTION public.video_r2_complete_job(
  p_job uuid, p_token uuid, p_storage_key text, p_byte_size bigint,
  p_sha256 text, p_duration_ms bigint, p_mime_type text DEFAULT 'video/mp4'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_project uuid; v_asset uuid;
BEGIN
  SELECT project_id INTO v_project FROM video_r2_jobs
  WHERE id=p_job AND status='processing' AND lease_token=p_token AND lease_expires_at >= now()
  FOR UPDATE;
  IF v_project IS NULL THEN RETURN NULL; END IF;
  INSERT INTO video_r2_assets(project_id,kind,storage_key,status,mime_type,byte_size,checksum_sha256,duration_ms,verified_at)
  VALUES(v_project,'master',p_storage_key,'ready',p_mime_type,p_byte_size,p_sha256,p_duration_ms,now())
  RETURNING id INTO v_asset;
  UPDATE video_r2_jobs SET status='succeeded',output_asset_id=v_asset,finished_at=now(),
    lease_owner=NULL,lease_token=NULL,lease_expires_at=NULL WHERE id=p_job AND lease_token=p_token;
  RETURN v_asset;
END $$;

CREATE OR REPLACE FUNCTION public.video_r2_fail_job(
  p_job uuid, p_token uuid, p_code text, p_message text, p_retryable boolean
)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_attempt int; v_max int; v_status text;
BEGIN
  SELECT attempt_count,max_attempts INTO v_attempt,v_max FROM video_r2_jobs
  WHERE id=p_job AND status='processing' AND lease_token=p_token FOR UPDATE;
  IF NOT FOUND THEN RETURN 'stale'; END IF;
  IF p_retryable AND v_attempt < v_max THEN
    UPDATE video_r2_jobs SET status='queued',not_before=now()+
      CASE WHEN v_attempt <= 1 THEN interval '1 minute' ELSE interval '5 minutes' END,
      error_code=p_code,last_error=left(p_message,4000),lease_owner=NULL,lease_token=NULL,lease_expires_at=NULL
    WHERE id=p_job;
    v_status:='queued';
  ELSE
    UPDATE video_r2_jobs SET status='failed',error_code=p_code,last_error=left(p_message,4000),
      finished_at=now(),lease_owner=NULL,lease_token=NULL,lease_expires_at=NULL WHERE id=p_job;
    v_status:='failed';
  END IF;
  RETURN v_status;
END $$;

REVOKE ALL ON FUNCTION public.video_r2_claim_job(uuid,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.video_r2_heartbeat(uuid,uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.video_r2_complete_job(uuid,uuid,text,bigint,text,bigint,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.video_r2_fail_job(uuid,uuid,text,text,boolean) FROM PUBLIC;

COMMIT;
