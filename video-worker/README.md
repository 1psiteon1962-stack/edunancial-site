# Edunancial Video Worker

Deploy this directory as its own Docker service (for example on Railway). It is intentionally colocated with the main repository so the worker can be reviewed and versioned with the website while still running as an independent service.

## Required environment

Copy `.env.example` values into the deployment environment.

- `WORKER_SHARED_SECRET` must be at least 32 characters and must exactly match the secret configured on the Edunancial website.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must point to the Supabase project that owns the video tables and private storage buckets.
- `PROCESSED_VIDEO_BUCKET` defaults to `processed-videos`.
- Set the website's `WORKER_BASE_URL` to this worker's public HTTPS origin. Production dispatch rejects a non-HTTPS worker URL.

## Endpoints

- `GET /health` — deployment health check.
- `POST /internal/jobs/:jobId/execute` — HMAC-authenticated render dispatch from Edunancial. The request includes timestamp, unique request ID, body hash, and signature; replayed request IDs are rejected.

## Current Marketing Short behavior

The worker supports the current Video Studio composition model:

1. Downloads private image/video scene assets from Supabase.
2. Creates 1080 × 1920 H.264 scene clips with contain/cover fitting.
3. Applies optional scene text overlays.
4. Applies cut, crossfade, wipe, or slide transitions.
5. Concatenates the scenes into a vertical marketing video.
6. Mixes optional narration and background music at the volumes selected in Video Studio.
7. Uploads the rendered MP4 to the private `processed-videos` bucket.
8. Registers the output asset and marks the render job/project complete.
9. The authenticated website API creates a temporary signed output URL so the owner can preview and download the finished MP4.

The worker acknowledges a valid dispatch immediately with HTTP 202 and renders asynchronously. Completed jobs are idempotent: redispatching a completed job does not render it again.

## First sample-video readiness check

Before attempting the first sample render:

1. Deploy this `video-worker` directory as a Docker service with FFmpeg available from the included Dockerfile.
2. Confirm `GET /health` returns `{ "ok": true, "service": "edunancial-video-worker" }`.
3. Configure the worker environment variables listed above.
4. Configure the website with the same `WORKER_SHARED_SECRET` and the worker's HTTPS `WORKER_BASE_URL`.
5. Confirm the Supabase video migration has been applied and the private raw/processed video buckets exist.
6. Sign in to the Edunancial owner/admin dashboard and open `/admin/video-studio`.
7. Start with one or two images, a short title, and no narration/music. Render that minimal Short first.
8. After the basic render succeeds, add narration, music, overlays, and transitions for the full sample.

If dispatch configuration is missing or the worker cannot be reached, the website now marks the created render job/project as failed instead of leaving it indefinitely queued.
