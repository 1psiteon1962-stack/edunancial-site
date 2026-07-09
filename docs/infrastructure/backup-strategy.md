# Backup Strategy

## Overview

The backup platform uses a **provider/adapter pattern** so scheduling logic and the admin dashboard are decoupled from the actual storage backend. The default `DemoBackupProvider` is a safe placeholder — no credentials are needed in development.

## Backup Targets

| Target | Description | Recommended Frequency | Geo Redundancy |
|---|---|---|---|
| `database` | Primary PostgreSQL + replicas | Daily (full) + Hourly (WAL) | ✓ |
| `user_uploads` | User-uploaded files (avatars, documents) | Daily | ✓ |
| `config_files` | Environment configuration and secrets references | Weekly | — |
| `cms_content` | CMS pages, blog posts, landing pages | Daily | ✓ |
| `course_assets` | Video files, PDFs, course materials | Weekly | ✓ |
| `system_settings` | Application settings, feature flags | Daily | — |

## Default Schedules

Defined in `src/lib/backup/providers.ts` → `getDemoSchedules()`:

| Schedule ID | Target | Frequency | Retention | Geo |
|---|---|---|---|---|
| sch-db-daily | database | daily | 30 backups | ✓ |
| sch-db-hourly | database (WAL) | hourly | 48 snapshots | — |
| sch-uploads-daily | user_uploads | daily | 14 backups | ✓ |
| sch-config-weekly | config_files | weekly | 8 backups | — |
| sch-cms-daily | cms_content | daily | 30 backups | ✓ |
| sch-courses-weekly | course_assets | weekly | 4 backups | ✓ |
| sch-settings-daily | system_settings | daily | 14 backups | — |

## Point-in-Time Recovery (PITR)

PITR is modeled via `PointInTimeRecoveryConfig`:

```typescript
const pitConfig: PointInTimeRecoveryConfig = {
  enabled: true,
  target: 'database',
  walArchivingEnabled: true,       // requires PostgreSQL WAL archiving
  maxRecoveryWindowHours: 24,
  storageUri: 's3://my-wal-archive/',
};
```

Enable WAL archiving in PostgreSQL (`archive_mode = on`, `archive_command`) and set `storageUri` to your WAL archive location.

## Backup Verification

Every backup should be verified before it's considered reliable for recovery:

```typescript
const result = await provider.verify(backupId);
// result.checksumValid — integrity check passed
// result.restoreTestPassed — restore to staging succeeded
```

Schedule weekly automated verification using your cron/job framework.

## Restore Workflow

Restore requests are modeled via `RestoreRequest`:

1. Operator creates a `RestoreRequest` targeting a specific `backupId` and `targetEnvironment`
2. A second approver (`approvedBy`) signs off
3. The restore runs against the target environment (`staging`, `dr-standby`, or `production`)
4. Status is tracked through `pending → approved → running → completed`

## Integrating a Production Provider

Implement `BackupProvider` and call `setBackupProvider()`:

```typescript
import { setBackupProvider } from '@/lib/backup';

class S3BackupProvider implements BackupProvider {
  name = 's3';
  async store(target, data, metadata) { /* upload to S3 */ }
  async retrieve(backupId)            { /* download from S3 */ }
  async list(target?)                 { /* list S3 objects */ }
  async delete(backupId)              { /* delete S3 object */ }
  async verify(backupId)              { /* checksum + restore test */ }
  async healthCheck()                 { /* ping S3 */ }
}

setBackupProvider(new S3BackupProvider());
```

## Geographic Redundancy

Set `geoRedundancy: true` on any `BackupSchedule` and configure your provider to replicate to a secondary region after each successful backup. Use different cloud regions (e.g., `us-east-1` + `eu-west-1`) or different cloud providers for maximum resilience.

## Admin Dashboard

The backup management dashboard is available at `/admin/backups`. It shows:
- Summary stats (total, verified, failed, storage used)
- Schedule status with last/next run times
- Full backup record history with status and size
- Restore and verification action hooks (ready for wiring)
