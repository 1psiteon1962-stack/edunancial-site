-- Video Maker R2 queue hardening: scope idempotency to a project.
-- Active duplicate protection remains project + locale through video_r2_jobs_one_active.

BEGIN;

ALTER TABLE public.video_r2_jobs
  DROP CONSTRAINT IF EXISTS video_r2_jobs_idempotency_key_key;

CREATE UNIQUE INDEX IF NOT EXISTS video_r2_jobs_project_idempotency
  ON public.video_r2_jobs (project_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

COMMIT;
