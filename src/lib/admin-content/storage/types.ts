import type { AuditEvent, BatchSummary, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

export interface AdminContentStorage {
  createBatch(batch: UploadBatch): Promise<UploadBatch>;
  updateBatch(batch: UploadBatch): Promise<UploadBatch>;
  removeBatch(batchId: string): Promise<void>;
  updateBatchIndex(summaries: BatchSummary[]): Promise<void>;
  listBatches(): Promise<BatchSummary[]>;
  getBatch(batchId: string): Promise<UploadBatch | null>;
  saveBinary(path: string, content: Buffer, contentType: string): Promise<void>;
  deleteBinary(path: string): Promise<void>;
  readBinary(path: string): Promise<Buffer | null>;
  /** Compare-and-swap update for shared indexes; retries re-apply mutate to fresh bytes. */
  updateBinary?(path: string, mutate: (current: Buffer | null) => Buffer | null, message?: string): Promise<boolean>;
  /** Create only when absent. Returns false when the object already exists. */
  createIfAbsent?(path: string, content: Buffer, contentType: string, message?: string): Promise<boolean>;
  /** Delete only when the current bytes still match expected. */
  deleteIfVersion?(path: string, expected: Buffer, message?: string): Promise<boolean>;
  appendAuditEvent(event: AuditEvent): Promise<void>;
  listAuditHistory(batchId?: string): Promise<AuditEvent[]>;
  createExport(exportPackage: ExportPackage, archive: Buffer): Promise<ExportPackage>;
  listWorkspaceEntries(): Promise<string[]>;
  /**
   * Returns a time-limited signed URL that a browser can PUT a single file to,
   * uploading directly to backend storage without routing through the Netlify
   * serverless function.  Returns null when the storage backend does not
   * support signed uploads (e.g. local development store).
   */
  getSignedUploadUrl(path: string): Promise<string | null>;
}
