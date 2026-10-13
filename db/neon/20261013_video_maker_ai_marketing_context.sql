-- Video Maker R2: additive AI marketing context foundation.
-- Keeps the render worker purpose-agnostic while making marketing outputs attributable.
-- No existing column or row is removed or rewritten.

BEGIN;

ALTER TABLE public.video_r2_projects
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('manual','curriculum','blog','marketing_brief','existing_asset','ai_generated')),
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS audience text,
  ADD COLUMN IF NOT EXISTS platform text,
  ADD COLUMN IF NOT EXISTS marketing_objective text,
  ADD COLUMN IF NOT EXISTS campaign_id text,
  ADD COLUMN IF NOT EXISTS source_ref text,
  ADD COLUMN IF NOT EXISTS ai_brief jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.video_r2_projects
  DROP CONSTRAINT IF EXISTS video_r2_projects_country_code_format,
  ADD CONSTRAINT video_r2_projects_country_code_format
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
  DROP CONSTRAINT IF EXISTS video_r2_projects_platform_value,
  ADD CONSTRAINT video_r2_projects_platform_value
    CHECK (platform IS NULL OR platform IN ('linkedin','instagram','facebook','youtube','tiktok','other')),
  DROP CONSTRAINT IF EXISTS video_r2_projects_marketing_objective_value,
  ADD CONSTRAINT video_r2_projects_marketing_objective_value
    CHECK (marketing_objective IS NULL OR marketing_objective IN ('awareness','education','traffic','conversion','retention'));

CREATE INDEX IF NOT EXISTS video_r2_projects_campaign_idx
  ON public.video_r2_projects (campaign_id)
  WHERE campaign_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS video_r2_projects_market_idx
  ON public.video_r2_projects (country_code, default_locale, platform)
  WHERE purpose = 'marketing';

COMMIT;
