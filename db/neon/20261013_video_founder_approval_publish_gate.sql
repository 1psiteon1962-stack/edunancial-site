-- Video Maker: founder approval gate for AI-built marketing videos.
-- Publishing is fail-closed: only the exact approved immutable render may be queued.

BEGIN;

ALTER TABLE public.video_r2_projects
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'draft'
    CHECK (review_status IN ('draft','ai_generating','ready_for_review','revision_requested','rejected','approved','publish_queued','published')),
  ADD COLUMN IF NOT EXISTS approved_asset_id uuid REFERENCES public.video_r2_assets(id),
  ADD COLUMN IF NOT EXISTS approved_sha256 text,
  ADD COLUMN IF NOT EXISTS approved_by text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approval_note text;

CREATE TABLE IF NOT EXISTS public.video_r2_publish_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.video_r2_projects(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.video_r2_assets(id),
  platform text NOT NULL CHECK (platform IN ('linkedin','instagram','facebook','youtube','tiktok','other')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','publishing','published','failed','dead_letter')),
  idempotency_key text NOT NULL UNIQUE,
  caption text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  remote_post_id text,
  remote_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE OR REPLACE FUNCTION public.video_r2_queue_approved_publish(
  p_project_id uuid, p_platform text, p_caption text DEFAULT NULL, p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE p video_r2_projects%ROWTYPE; a video_r2_assets%ROWTYPE; k text; jid uuid;
BEGIN
  SELECT * INTO p FROM video_r2_projects WHERE id=p_project_id FOR UPDATE;
  IF p.id IS NULL THEN RAISE EXCEPTION 'project_not_found'; END IF;
  IF p.review_status <> 'approved' OR p.approved_asset_id IS NULL OR p.approved_sha256 IS NULL THEN
    RAISE EXCEPTION 'founder_approval_required';
  END IF;
  SELECT * INTO a FROM video_r2_assets WHERE id=p.approved_asset_id;
  IF a.id IS NULL OR a.sha256 IS DISTINCT FROM p.approved_sha256 THEN
    RAISE EXCEPTION 'approved_asset_changed';
  END IF;
  k := encode(digest(p.id::text || ':' || a.id::text || ':' || p_platform || ':' || p.approved_sha256,'sha256'),'hex');
  INSERT INTO video_r2_publish_jobs(project_id,asset_id,platform,idempotency_key,caption,metadata)
  VALUES(p.id,a.id,p_platform,k,p_caption,coalesce(p_metadata,'{}'::jsonb))
  ON CONFLICT(idempotency_key) DO UPDATE SET idempotency_key=excluded.idempotency_key
  RETURNING id INTO jid;
  UPDATE video_r2_projects SET review_status='publish_queued' WHERE id=p.id;
  RETURN jid;
END $$;

COMMIT;
