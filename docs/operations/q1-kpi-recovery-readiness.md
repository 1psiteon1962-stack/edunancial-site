# Q1 KPI Recovery — production activation checklist

## Database prerequisite
The existing manual GitHub Actions workflow `Manual Neon KPI Events Migration`
requires production-environment approval and explicit confirmation
`APPLY_KPI_EVENTS`. It now applies both the base KPI table migration
(`20261002_kpi_events.sql`) and the unique replay-key migration
(`20261018_kpi_replay_idempotency.sql`), then verifies both objects.

Do not set `KPI_REPLAY_MIGRATION_APPLIED=true` until the workflow has
successfully run against the intended production Neon database and the
schema has been independently verified.

## Replay authorization
The replay implementation in PR #1302 must be published and its tests pass.
Replay must be invoked only from a protected server-side caller.
It must require `KPI_SPOOL_REPLAY_ENABLED=true` and
`KPI_REPLAY_MIGRATION_APPLIED=true` before reading Blob storage.
Do not expose an unauthenticated HTTP endpoint or enable automatic
replay until the recovery entrypoint and authorization are verified.

## Acceptance
1. Confirm production Neon has `public.kpi_events` and
   `public.uq_kpi_events_replay_key`.
2. Simulate primary and fallback KPI persistence failures; confirm an event
   is stored in Netlify Blobs with a `pending/` key.
3. Run one authorized bounded recovery batch; confirm exactly one Neon row
   and removal of its Blob after successful insertion.
4. Repeat the same event with the same replay key; confirm no duplicate.
5. Simulate a Neon failure; confirm the Blob is retained for retry.
6. Confirm replay is denied when either authorization flag is absent.
7. Confirm primary Netlify production deployment is published.

Do not mark Q1 complete based only on merged pull requests or preview builds.
