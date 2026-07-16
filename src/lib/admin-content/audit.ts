import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { AuditEvent, UploadBatch } from "@/lib/admin-content/types";

export async function appendGlobalAuditEvent(event: AuditEvent) {
  await getAdminContentStorage().appendAuditEvent(event);
}

export async function appendBatchAuditEvent(batch: UploadBatch, event: AuditEvent) {
  batch.auditHistory.unshift(event);
  await getAdminContentStorage().appendAuditEvent(event);
}
