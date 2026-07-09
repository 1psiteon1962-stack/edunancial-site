import {
  BackupCadence,
  BackupExecution,
  BackupExecutionStatus,
  BackupPolicy,
  RestoreTestStatus,
  VerificationStatus,
} from "@/lib/operations/types";

const cadenceToHours: Record<BackupCadence, number> = {
  hourly: 1,
  daily: 24,
  weekly: 24 * 7,
};

function shiftIsoDate(timestamp: string, hours: number) {
  const date = new Date(timestamp);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export function scheduleNextBackup(policy: Omit<BackupPolicy, "nextScheduledAt">, from = new Date().toISOString()): BackupPolicy {
  return {
    ...policy,
    nextScheduledAt: shiftIsoDate(from, cadenceToHours[policy.cadence]),
  };
}

export function createBackupExecution(policy: BackupPolicy, scheduledFor = policy.nextScheduledAt): BackupExecution {
  return {
    id: `${policy.id}-${scheduledFor}`,
    policyId: policy.id,
    resource: policy.resource,
    scheduledFor,
    status: "scheduled",
    location: policy.geoRedundant ? "multi-region-object-storage" : "primary-region-vault",
    sizeGb: 0,
    verification: { status: "pending" },
    restoreTest: { status: "pending" },
  };
}

export function transitionBackupExecution(
  execution: BackupExecution,
  nextStatus: BackupExecutionStatus,
  timestamp: string,
  sizeGb = execution.sizeGb,
) {
  if (execution.status === "scheduled" && nextStatus === "running") {
    return {
      ...execution,
      status: nextStatus,
      startedAt: timestamp,
    };
  }

  if (execution.status === "running" && (nextStatus === "succeeded" || nextStatus === "failed")) {
    return {
      ...execution,
      status: nextStatus,
      completedAt: timestamp,
      sizeGb,
    };
  }

  throw new Error(`Invalid backup transition from ${execution.status} to ${nextStatus}.`);
}

export function verifyBackupExecution(
  execution: BackupExecution,
  verificationStatus: VerificationStatus,
  checkedAt: string,
  notes: string,
) {
  if (execution.status !== "succeeded") {
    throw new Error("Only successful backups can be verified.");
  }

  return {
    ...execution,
    verification: {
      status: verificationStatus,
      checkedAt,
      notes,
    },
  };
}

export function recordRestoreTest(
  execution: BackupExecution,
  restoreStatus: RestoreTestStatus,
  testedAt: string,
  notes: string,
) {
  if (execution.verification.status !== "verified") {
    throw new Error("Restore tests require a verified backup.");
  }

  return {
    ...execution,
    restoreTest: {
      status: restoreStatus,
      testedAt,
      notes,
    },
  };
}

export function calculateBackupSuccessRate(backups: BackupExecution[]) {
  if (backups.length === 0) {
    return 100;
  }

  const succeeded = backups.filter((backup) => backup.status === "succeeded").length;
  return Number(((succeeded / backups.length) * 100).toFixed(2));
}
