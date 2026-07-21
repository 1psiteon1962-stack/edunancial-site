import type { AuditEvent, BatchSummary, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

export interface AdminContentStorage {
  createBatch(batch: UploadBatch): Promise<UploadBatch>;
  updateBatch(batch: UploadBatch): Promise<UploadBatch>;
  listBatches(): Promise<BatchSummary[]>;
  getBatch(batchId: string): Promise<UploadBatch | null>;
  saveBinary(path: string, content: Buffer, contentType: string): Promise<void>;
  deleteBinary(path: string): Promise<void>;
  readBinary(path: string): Promise<Buffer | null>;
  appendAuditEvent(event: AuditEvent): Promise<void>;
  listAuditHistory(batchId?: string): Promise<AuditEvent[]>;
  createExport(exportPackage: ExportPackage, archive: Buffer): Promise<ExportPackage>;
  /**
   * Returns a time-limited signed URL that a browser can PUT a single file to,
   * uploading directly to backend storage without routing through the Netlify
   * serverless function.  Returns null when the storage backend does not
   * support signed uploads (e.g. local development store).
   */
  getSignedUploadUrl(path: string): Promise<string | null>;
}
