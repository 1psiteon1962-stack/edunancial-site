import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { AuditEvent, UploadBatch } from "@/lib/admin-content/types";
import { logger } from "@/lib/observability/logger";

const BATCH_LOCAL_ONLY_ACTIONS = new Set(["file-uploaded", "archive-extracted"]);

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

  // High-volume upload events remain durably embedded in the batch record but
  // do not rewrite the global audit object for every file/archive. In
  // production that global audit history is stored as one JSON object in
  // Supabase, so rewriting it for each package causes avoidable network round
  // trips and can push otherwise-small curriculum batches into serverless
  // gateway timeouts. High-level lifecycle and failure events still persist to
  // the global audit history, while upload operations are also recorded in the
  // admin_upload_operations table.
  if (BATCH_LOCAL_ONLY_ACTIONS.has(event.action)) return;

  await getAdminContentStorage().appendAuditEvent(event);
}
