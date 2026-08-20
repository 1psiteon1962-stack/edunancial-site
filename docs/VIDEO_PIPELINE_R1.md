# Edunancial Video Pipeline — R1

## Scope
R1 is limited to raw upload, project/asset/job persistence, authenticated worker dispatch, FFmpeg master rendering, processed-video upload, and job status. It intentionally excludes transcription, translation, subtitles, YouTube, Cloudflare Stream, and music-library population.

## Site API
- `POST /api/admin/video/projects` — admin-authenticated + CSRF-protected project creation and signed upload URL issuance.
- `POST /api/admin/video/jobs` — admin-authenticated + CSRF-protected render-job creation and HMAC worker dispatch.
- `GET /api/admin/video/jobs/:jobId` — admin-authenticated status polling.

## Required Netlify environment
- `WORKER_BASE_URL`
- `WORKER_SHARED_SECRET` — minimum 32 characters; same value as the worker.
- Existing Supabase server credentials remain required.

## Worker request contract
`POST /internal/jobs/:jobId/execute` with JSON `{ "jobId": "<uuid>" }` and headers:
- `X-Edunancial-Timestamp`
- `X-Edunancial-Request-Id`
- `X-Edunancial-Signature`

Canonical HMAC input is five newline-separated values: timestamp, request ID, uppercase HTTP method, request path, SHA-256 hex digest of the exact body. Signature is lowercase HMAC-SHA256 hex using `WORKER_SHARED_SECRET`.

The worker must reject stale timestamps, invalid signatures, and previously accepted request IDs. It must record accepted request IDs in `video_worker_requests` before processing.

## Worker behavior
1. Fetch `video_jobs` and its `RAW_VIDEO` asset using the Supabase service role.
2. Atomically transition the job from `queued` to `processing`, increment `attempt_count`, and set `started_at`.
3. Download only the referenced object from the `raw-videos` bucket to temporary disk.
4. Apply the validated trim recipe with FFmpeg. R1 leaves `musicStoragePath` null.
5. Upload `master.mp4` to `processed-videos/projects/<projectId>/master/<jobId>/master.mp4`.
6. Insert one `EDITED_MASTER` asset, update the job to `succeeded` with `output_asset_id`, and update the project to `master_ready`.
7. On failure, set job/project to `failed`, store a sanitized `last_error`, and remove temporary files.
8. Repeated execution of an already-succeeded job must return success without creating another master asset.

## Storage
Migration `20260820_000001_video_pipeline_r1.sql` creates the R1 tables and ensures private `raw-videos` and `processed-videos` buckets exist.

## Verification
1. Worker `/health` returns HTTP 200 and `{ "ok": true }`.
2. Authenticated project creation returns project/asset IDs and a signed upload URL.
3. Upload a short MP4 to that signed URL.
4. Trigger a render with `{ "trimStart": 0, "trimEnd": 5 }`.
5. Poll the returned job ID until `succeeded`.
6. Confirm one `EDITED_MASTER` row and the corresponding `master.mp4` in `processed-videos`.

## Deployment boundary
The site work remains on `feature/video-studio-r1` until review. The worker is a separate `1psiteon1962-stack/edunancial-video-worker` repository. No R2+ capability belongs in this release.
