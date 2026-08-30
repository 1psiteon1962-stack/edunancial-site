# Edunancial Video Worker R1

External FFmpeg renderer for the Edunancial Video Studio.

Required environment variables:
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `WORKER_SHARED_SECRET` (same 32+ character secret configured on the website)
- `PORT` is optional and defaults to 8080

Deployment requirements:
- Docker-capable service with outbound HTTPS access
- Health check: `GET /health`
- Website `WORKER_BASE_URL` must point to the deployed HTTPS origin

The worker validates HMAC signatures and timestamps, records request IDs in `video_worker_requests` for replay protection, renders a 1080x1920 H.264 MP4 with FFmpeg, uploads the master to the private `processed-videos` bucket, and updates `video_jobs` / `video_projects`.
