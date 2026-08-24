# Edunancial Video Worker R1

Deploy this directory as its own Docker service (for example on Railway). It is intentionally colocated with the main repository so the worker can be reviewed and versioned without requiring a second GitHub repository.

## Required environment

Copy `.env.example` values into the deployment environment. `WORKER_SHARED_SECRET` must exactly match the secret configured on the Edunancial website. Set the website's `WORKER_BASE_URL` to this service's public HTTPS origin.

## Endpoints

- `GET /health` - deployment health check.
- `POST /v1/render` - HMAC-authenticated render dispatch from Edunancial.

## R1 render behavior

The worker downloads private source assets from Supabase, creates 1080x1920 H.264 clips with FFmpeg, concatenates them into a vertical MP4, uploads the result to the private `processed-videos` bucket, and updates `video_render_jobs`.

The endpoint acknowledges a valid job immediately with HTTP 202 and renders asynchronously. Completed jobs are idempotent: redispatching a completed job does not render it again.

R1 intentionally focuses on reliable artwork-to-Short rendering. Scene text overlays, transitions, narration/audio mixing, preview controls, and direct social publishing are subsequent layers.
