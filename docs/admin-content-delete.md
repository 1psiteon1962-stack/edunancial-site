# Admin Content Workspace Deletion & Cleanup

## Safety boundary
- Deletion endpoints only affect **admin content workspace ingestion artifacts**.
- Deletion does **not** delete:
  - GitHub repository history
  - already merged PR content
  - live production website content

## Protected destructive APIs
- `DELETE /api/admin/content/batches/[batchId]`
- `DELETE /api/admin/content/batches/[batchId]/files/[fileId]`
- `POST /api/admin/content/batches/bulk-delete`
- `POST /api/admin/content/batches/[batchId]/files/bulk-delete`
- `POST /api/admin/content/maintenance/delete-failed`
- `POST /api/admin/content/maintenance/clear-workspace`
- `GET|POST /api/admin/content/maintenance/orphans`
- `GET /api/admin/content/maintenance/stats`

All state-changing routes require admin session + CSRF header + same-origin checks.

## Cleanup behavior
Centralized cleanup service removes workspace artifacts idempotently and tolerates missing objects:
- batch JSON records
- uploaded source files/archives
- export ZIP packages and related manifests/audit/warnings/rejected-file artifacts
- export metadata records
- orphaned workspace objects
- batch index entries

## Exported batch deletion
Exported batches require explicit confirmation in the UI before deletion.
Audit metadata preserves export references (branch/PR/PR number and commit SHA when available).

## High-risk clear workspace
`/admin/content/maintenance` requires typed confirmation:

`DELETE ALL WORKSPACE CONTENT`

before server-side clear-workspace execution.

## Audit events
Deletion and cleanup emit structured audit events:
- `content_file_deleted`
- `content_files_bulk_deleted`
- `content_batch_deleted`
- `content_batches_bulk_deleted`
- `failed_batches_deleted`
- `workspace_orphans_scanned`
- `workspace_orphans_deleted`
- `workspace_cleared`
- `content_batch_purged`

## Recovery model
Workspace binary artifacts use hard deletion. Recovery relies on:
- retained global audit history
- exported branch/PR metadata in audit events
- GitHub repository history for already exported/merged content
