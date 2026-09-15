import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { AuditEvent } from "@/lib/admin-content/types";

export type UploadOperationPhase = "PRESIGN" | "TRANSFER" | "FINALIZE" | "LEGACY_UPLOAD" | "PUBLISH" | "VERIFY";
export type UploadOperationStatus = "STARTED" | "SUCCEEDED" | "FAILED" | "FALLBACK";

export interface UploadOperationInput {
  batchId?: string | null;
  uploadId?: string | null;
  phase: UploadOperationPhase;
  status: UploadOperationStatus;
  storagePath?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
}

function resultFor(status: UploadOperationStatus): AuditEvent["result"] {
  if (status === "FAILED") return "failure";
  if (status === "FALLBACK") return "warning";
  return "success";
}

/**
 * Persist uploader operation telemetry in the same GitHub-backed admin-content
 * storage used by production uploads. The curriculum upload path must never
 * depend on Supabase for audit, finalization, recovery, or verification.
 */
export async function recordUploadOperation(input: UploadOperationInput): Promise<void> {
  try {
    const storage = getAdminContentStorage();
    await storage.appendAuditEvent({
      id: `upload-operation-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "system-error",
      result: resultFor(input.status),
      actor: "admin-content-uploader",
      batchId: input.batchId ?? undefined,
      metadata: {
        kind: "upload-operation",
        uploadId: input.uploadId ?? null,
        phase: input.phase,
        status: input.status,
        storagePath: input.storagePath ?? null,
        fileName: input.fileName ?? null,
        fileSize: input.fileSize ?? null,
        errorCode: input.errorCode ?? null,
        errorMessage: input.errorMessage ?? null,
        ...(input.metadata ?? {}),
      },
    });
  } catch (error) {
    // Audit telemetry must never block an otherwise valid upload/finalization.
    console.warn("[upload-operations] GitHub-backed audit unavailable", error);
  }
}
