import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

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

type UploadOperationRow = {
  batch_id: string | null;
  upload_id: string | null;
  phase: UploadOperationPhase;
  status: UploadOperationStatus;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
  error_code: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
};

export async function recordUploadOperation(input: UploadOperationInput): Promise<void> {
  try {
    const db = getKpiSupabaseAdmin();
    const row: UploadOperationRow = {
      batch_id: input.batchId ?? null,
      upload_id: input.uploadId ?? null,
      phase: input.phase,
      status: input.status,
      storage_path: input.storagePath ?? null,
      file_name: input.fileName ?? null,
      file_size: input.fileSize ?? null,
      error_code: input.errorCode ?? null,
      error_message: input.errorMessage ?? null,
      metadata: input.metadata ?? {},
    };
    const { error } = await db.from("admin_upload_operations").insert(row as never);
    if (error) console.warn("[upload-operations] audit write failed", error.message);
  } catch (error) {
    console.warn("[upload-operations] audit unavailable", error);
  }
}
