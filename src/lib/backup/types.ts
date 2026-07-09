// ─── Backup & Recovery Types ──────────────────────────────────────────────────

export type BackupTarget =
  | "database"
  | "user_uploads"
  | "config_files"
  | "cms_content"
  | "course_assets"
  | "system_settings";

export type BackupStatus =
  | "scheduled"
  | "running"
  | "completed"
  | "failed"
  | "verifying"
  | "verified"
  | "restoring";

export type BackupFrequency = "hourly" | "daily" | "weekly" | "monthly";

export interface BackupSchedule {
  id: string;
  name: string;
  target: BackupTarget;
  frequency: BackupFrequency;
  retentionCount: number; // number of backups to keep
  enabled: boolean;
  lastRunAt?: number;
  nextRunAt: number;
  geoRedundancy: boolean; // store in a second geographic region
}

export interface BackupRecord {
  id: string;
  scheduleId: string;
  target: BackupTarget;
  status: BackupStatus;
  startedAt: number;
  completedAt?: number;
  sizeBytes?: number;
  locationUri?: string;
  checksum?: string;
  verified: boolean;
  verifiedAt?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface PointInTimeRecoveryConfig {
  enabled: boolean;
  target: BackupTarget;
  walArchivingEnabled: boolean;
  maxRecoveryWindowHours: number;
  storageUri?: string;
}

export interface BackupVerificationResult {
  backupId: string;
  passed: boolean;
  checksumValid: boolean;
  restoreTestPassed: boolean;
  testedAt: number;
  durationMs: number;
  notes?: string;
}

export interface RestoreRequest {
  id: string;
  backupId: string;
  requestedAt: number;
  requestedBy: string;
  targetEnvironment: "production" | "staging" | "dr-standby";
  status: "pending" | "approved" | "running" | "completed" | "failed";
  startedAt?: number;
  completedAt?: number;
  approvedBy?: string;
  notes?: string;
}

// ─── Backup Provider Interface (extension point) ──────────────────────────────

export interface BackupProvider {
  name: string;
  store(target: BackupTarget, data: Buffer, metadata: Record<string, unknown>): Promise<BackupRecord>;
  retrieve(backupId: string): Promise<Buffer>;
  list(target?: BackupTarget): Promise<BackupRecord[]>;
  delete(backupId: string): Promise<void>;
  verify(backupId: string): Promise<BackupVerificationResult>;
  healthCheck(): Promise<boolean>;
}

export interface BackupDashboardSummary {
  totalBackups: number;
  lastSuccessfulBackup: number;
  totalStorageBytes: number;
  verifiedCount: number;
  failedCount: number;
  schedules: BackupSchedule[];
  recentRecords: BackupRecord[];
}
