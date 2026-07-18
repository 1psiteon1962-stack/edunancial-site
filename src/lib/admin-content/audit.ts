import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { AuditEvent, UploadBatch } from "@/lib/admin-content/types";
import { logger } from "@/lib/observability/logger";

export async function appendGlobalAuditEvent(event: AuditEvent) {
  await getAdminContentStorage().appendAuditEvent(event);
}

export async function appendGlobalAuditEventSafely(event: AuditEvent) {
  try {
    await appendGlobalAuditEvent(event);
    return true;
  } catch (error) {
    logger.warn("admin.audit.append_failed", {
      action: event.action,
      result: event.result,
      batchId: event.batchId ?? null,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function appendBatchAuditEvent(batch: UploadBatch, event: AuditEvent) {
  batch.auditHistory.unshift(event);
  await getAdminContentStorage().appendAuditEvent(event);
}
