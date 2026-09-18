-- Video Maker selective backfill contract.
-- Run only after legacy rows are exported/staged into matching legacy_video_* staging tables.
-- Intentionally preserves successful/published material and avoids blind migration of failed/orphaned tests.
-- This file is documentation/executable SQL for the migration operator; it is not invoked by application runtime.

-- Candidate projects worth migrating:
--   1) project status is published/master_ready, OR
--   2) project has at least one succeeded render job.
-- Keep original UUIDs so asset/scene/audio/job relationships remain stable.

-- Example candidate selector once staging tables exist:
-- SELECT DISTINCT p.id
-- FROM legacy_video_projects p
-- LEFT JOIN legacy_video_jobs j
--   ON j.project_id = p.id AND j.status = 'succeeded'
-- WHERE p.status IN ('published', 'master_ready') OR j.id IS NOT NULL;

-- Before any production cutover verify, at minimum:
-- SELECT count(*) FROM video_projects;
-- SELECT count(*) FROM video_assets;
-- SELECT count(*) FROM video_scenes;
-- SELECT count(*) FROM video_audio_tracks;
-- SELECT count(*) FROM video_jobs WHERE status = 'succeeded';
-- SELECT count(*) FROM video_worker_requests;
--
-- Then verify every migrated asset's permanent object-storage key exists.
-- Do not remove legacy Supabase reads/fallbacks until metadata AND persistent media validation pass.
