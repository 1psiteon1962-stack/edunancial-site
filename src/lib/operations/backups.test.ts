import test from "node:test";
import assert from "node:assert/strict";

import {
  createBackupExecution,
  recordRestoreTest,
  scheduleNextBackup,
  transitionBackupExecution,
  verifyBackupExecution,
} from "@/lib/operations/backups";

test("backup scheduling and verification transitions are enforced", () => {
  const policy = scheduleNextBackup(
    {
      id: "db-primary",
      resource: "Primary database",
      cadence: "hourly",
      retentionDays: 35,
      geoRedundant: true,
      pointInTimeRecovery: true,
      verificationRequired: true,
    },
    "2026-07-09T00:00:00.000Z",
  );

  assert.equal(policy.nextScheduledAt, "2026-07-09T01:00:00.000Z");

  const scheduled = createBackupExecution(policy);
  const running = transitionBackupExecution(scheduled, "running", "2026-07-09T01:00:00.000Z");
  const succeeded = transitionBackupExecution(running, "succeeded", "2026-07-09T01:04:00.000Z", 12.4);
  const verified = verifyBackupExecution(succeeded, "verified", "2026-07-09T01:05:00.000Z", "Restore replay validated.");
  const restored = recordRestoreTest(verified, "passed", "2026-07-09T01:09:00.000Z", "Smoke tests passed.");

  assert.equal(restored.verification.status, "verified");
  assert.equal(restored.restoreTest.status, "passed");
  assert.equal(restored.sizeGb, 12.4);
});
