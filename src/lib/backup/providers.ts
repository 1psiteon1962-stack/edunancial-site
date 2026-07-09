import {
  type BackupRecord,
  type BackupSchedule,
  type BackupTarget,
  type BackupVerificationResult,
  type BackupDashboardSummary,
  type BackupProvider,
} from "./types";

// ─── Demo Backup Provider ─────────────────────────────────────────────────────
// Safe placeholder — no credentials needed. Replace with a real provider
// (S3, GCS, Azure Blob, etc.) by implementing BackupProvider.

export class DemoBackupProvider implements BackupProvider {
  name = "demo";

  async store(_target: BackupTarget, _data: Buffer, metadata: Record<string, unknown>): Promise<BackupRecord> {
    const now = Date.now();
    return {
      id: Math.random().toString(36).slice(2),
      scheduleId: String(metadata.scheduleId ?? "manual"),
      target: _target,
      status: "completed",
      startedAt: now - 5_000,
      completedAt: now,
      sizeBytes: Math.floor(Math.random() * 1_000_000_000),
      locationUri: `demo://backups/${_target}/${now}`,
      checksum: Math.random().toString(36).slice(2),
      verified: false,
      metadata,
    };
  }

  async retrieve(_backupId: string): Promise<Buffer> {
    return Buffer.from("DEMO_BACKUP_DATA");
  }

  async list(target?: BackupTarget): Promise<BackupRecord[]> {
    return getDemoBackupRecords().filter((r) => !target || r.target === target);
  }

  async delete(_backupId: string): Promise<void> {
    // no-op in demo
  }

  async verify(backupId: string): Promise<BackupVerificationResult> {
    return {
      backupId,
      passed: true,
      checksumValid: true,
      restoreTestPassed: true,
      testedAt: Date.now(),
      durationMs: Math.floor(Math.random() * 30_000) + 5_000,
      notes: "Demo verification — all checks simulated as passing",
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ─── Demo Data Fixtures ───────────────────────────────────────────────────────

export function getDemoSchedules(): BackupSchedule[] {
  const now = Date.now();
  return [
    { id: "sch-db-daily", name: "Database Daily Backup", target: "database", frequency: "daily", retentionCount: 30, enabled: true, lastRunAt: now - 3_600_000, nextRunAt: now + 82_800_000, geoRedundancy: true },
    { id: "sch-db-hourly", name: "Database WAL Snapshot", target: "database", frequency: "hourly", retentionCount: 48, enabled: true, lastRunAt: now - 1_800_000, nextRunAt: now + 1_800_000, geoRedundancy: false },
    { id: "sch-uploads-daily", name: "User Uploads Daily", target: "user_uploads", frequency: "daily", retentionCount: 14, enabled: true, lastRunAt: now - 4_200_000, nextRunAt: now + 82_800_000, geoRedundancy: true },
    { id: "sch-config-weekly", name: "Config Files Weekly", target: "config_files", frequency: "weekly", retentionCount: 8, enabled: true, lastRunAt: now - 86_400_000 * 3, nextRunAt: now + 86_400_000 * 4, geoRedundancy: false },
    { id: "sch-cms-daily", name: "CMS Content Daily", target: "cms_content", frequency: "daily", retentionCount: 30, enabled: true, lastRunAt: now - 3_600_000, nextRunAt: now + 82_800_000, geoRedundancy: true },
    { id: "sch-courses-weekly", name: "Course Assets Weekly", target: "course_assets", frequency: "weekly", retentionCount: 4, enabled: true, lastRunAt: now - 86_400_000 * 2, nextRunAt: now + 86_400_000 * 5, geoRedundancy: true },
    { id: "sch-settings-daily", name: "System Settings Daily", target: "system_settings", frequency: "daily", retentionCount: 14, enabled: true, lastRunAt: now - 3_600_000, nextRunAt: now + 82_800_000, geoRedundancy: false },
  ];
}

export function getDemoBackupRecords(): BackupRecord[] {
  const now = Date.now();
  const schedules = getDemoSchedules();
  const statuses: BackupRecord["status"][] = ["completed", "completed", "completed", "verified", "verified", "failed"];
  return schedules.flatMap((sched) =>
    Array.from({ length: 5 }, (_, i) => {
      const startedAt = now - (i + 1) * 86_400_000 - Math.floor(Math.random() * 3_600_000);
      const status = i === 2 && sched.id === "sch-db-daily" ? "failed" : statuses[Math.floor(Math.random() * statuses.length)];
      return {
        id: `${sched.id}-${i}`,
        scheduleId: sched.id,
        target: sched.target,
        status,
        startedAt,
        completedAt: status === "running" ? undefined : startedAt + Math.floor(Math.random() * 60_000) + 5_000,
        sizeBytes: Math.floor(Math.random() * 500_000_000) + 10_000_000,
        locationUri: status !== "failed" ? `demo://backups/${sched.target}/${startedAt}` : undefined,
        checksum: status !== "failed" ? Math.random().toString(36).slice(2) : undefined,
        verified: status === "verified",
        verifiedAt: status === "verified" ? startedAt + 120_000 : undefined,
        error: status === "failed" ? "Connection timeout to backup storage" : undefined,
      } satisfies BackupRecord;
    })
  );
}

export function getDemoSummary(): BackupDashboardSummary {
  const records = getDemoBackupRecords();
  const schedules = getDemoSchedules();
  const completed = records.filter((r) => r.status === "completed" || r.status === "verified");
  const lastSuccess = completed.length ? Math.max(...completed.map((r) => r.completedAt ?? 0)) : 0;
  const totalStorage = completed.reduce((acc, r) => acc + (r.sizeBytes ?? 0), 0);
  return {
    totalBackups: records.length,
    lastSuccessfulBackup: lastSuccess,
    totalStorageBytes: totalStorage,
    verifiedCount: records.filter((r) => r.verified).length,
    failedCount: records.filter((r) => r.status === "failed").length,
    schedules,
    recentRecords: records.slice(0, 10),
  };
}

// ─── Active provider ──────────────────────────────────────────────────────────

let _provider: BackupProvider = new DemoBackupProvider();

export function setBackupProvider(provider: BackupProvider): void {
  _provider = provider;
}

export function getBackupProvider(): BackupProvider {
  return _provider;
}
