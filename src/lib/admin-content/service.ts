import { extname } from "node:path";

import { DEFAULT_UPLOAD_RATE_LIMIT } from "@/lib/admin-content/config";
import { appendBatchAuditEvent } from "@/lib/admin-content/audit";
import { createAuditEvent } from "@/lib/admin-content/auth";
import { classifyFile } from "@/lib/admin-content/classification/classify";
import { extractPreview } from "@/lib/admin-content/extractors";
import { createExportPackage } from "@/lib/admin-content/export";
import { createGithubPullRequest } from "@/lib/admin-content/github";
import { deriveBatchStatus, toDuplicateStatus } from "@/lib/admin-content/review";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import {
  assertValidUploadName,
  extractZipEntries,
  validateBatchSize,
  validateFileSize,
  validateFileType,
  verifyDestinationPath,
} from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, BatchSummary, ExtractedFile, FileMetadataRecord, UploadBatch } from "@/lib/admin-content/types";
import { buildIntendedDestination, parseUploadConfig, toAcademyLevel, type UploadConfig } from "@/lib/admin-content/upload-intake";
import { createId, encodeBase64, nowIso, normalizeSimilarityText, sha256, slugify } from "@/lib/admin-content/utils";

function defaultMetadata(batchId: string, source: string, title: string, checksum: string): FileMetadataRecord {
  return {
    language: "en",
    region: null,
    title,
    description: "",
    source,
    intendedDestination: "",
    contentType: "uncategorized",
    pillar: "uncategorized",
    academyLevel: null,
    publicationStatus: "draft",
    version: "1.0.0",
    checksum,
    uploadBatchId: batchId,
  };
}

async function listExistingFiles() {
  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const batches = await Promise.all(summaries.slice(0, 50).map((summary) => storage.getBatch(summary.id)));
  return batches.flatMap((batch) => batch?.files ?? []);
}

function detectConflicts(current: ExtractedFile, existingFiles: ExtractedFile[]) {
  for (const existing of existingFiles) {
    if (existing.checksum === current.checksum) return "exact-duplicate" as const;
    if (existing.classification.destination === current.classification.destination && existing.checksum !== current.checksum) {
      return "destination-conflict" as const;
    }
    if (existing.normalizedFilename === current.normalizedFilename && existing.checksum !== current.checksum) {
      return "revision" as const;
    }
    if (
      current.rawText &&
      existing.rawText &&
      normalizeSimilarityText(current.rawText).slice(0, 200) === normalizeSimilarityText(existing.rawText).slice(0, 200)
    ) {
      return "probable-duplicate" as const;
    }
    if (
      existing.normalizedFilename === current.normalizedFilename &&
      (existing.metadata.pillar !== current.metadata.pillar || existing.metadata.academyLevel !== current.metadata.academyLevel)
    ) {
      return "classification-conflict" as const;
    }
  }
  return "none" as const;
}

function createReviewFile(
  batchId: string,
  uploadId: string,
  originalFilename: string,
  archivePath: string | null,
  sourceArchiveFilename: string | null,
  mimeType: string,
  buffer: Buffer,
  source: string,
  config: UploadConfig,
) {
  const normalizedFilename = assertValidUploadName(originalFilename);
  const checksum = sha256(buffer);
  const preview = extractPreview(normalizedFilename, mimeType, buffer);
  const timestamp = nowIso();
  const baseFile = {
    id: createId("file"),
    batchId,
    uploadId,
    originalFilename,
    normalizedFilename,
    archivePath,
    sourceArchiveFilename,
    extension: extname(normalizedFilename).toLowerCase(),
    mimeType,
    sizeBytes: buffer.length,
    checksum,
    processingStatus: "classified" as const,
    reviewStatus: "pending" as const,
    conflictStatus: "none" as const,
    duplicateStatus: "new" as const,
    previewText: preview.previewText,
    rawText: preview.rawText,
    encodedContent: encodeBase64(buffer),
    classification: {
      category: config.destination === "courses" ? ("courses" as const) : ("books" as const),
      subcategory: null,
      language: config.language,
      academyLevel: config.destination === "courses" ? toAcademyLevel(config.level) : null,
      destination: buildIntendedDestination(config, normalizedFilename, uploadId),
      confidence: 1,
      reasons: [`explicit-destination:${config.destination}`],
      pillar: config.destination === "courses" ? config.track : "uncategorized",
    },
    metadata: defaultMetadata(batchId, source, normalizedFilename, checksum),
    warnings: [] as string[],
    error: null,
    approvedAt: null,
    rejectedAt: null,
    updatedAt: timestamp,
  };
  const classification = classifyFile(baseFile);
  return {
    ...baseFile,
    classification: {
      ...classification,
      category: config.destination === "courses" ? ("courses" as const) : classification.category,
      language: config.language,
      academyLevel: config.destination === "courses" ? toAcademyLevel(config.level) : classification.academyLevel,
      destination: buildIntendedDestination(config, normalizedFilename, uploadId),
      pillar: config.destination === "courses" ? config.track : classification.pillar,
    },
    metadata: {
      ...baseFile.metadata,
      title: config.title || normalizedFilename,
      description: config.description,
      language: config.language,
      contentType: config.destination === "courses" ? "courses" : classification.category,
      pillar: config.destination === "courses" ? config.track : classification.pillar,
      academyLevel: config.destination === "courses" ? toAcademyLevel(config.level) : classification.academyLevel,
      intendedDestination: buildIntendedDestination(config, normalizedFilename, uploadId),
      publicationStatus: config.publicationStatus,
    },
  } satisfies ExtractedFile;
}

async function processUploadFile(batchId: string, source: string, file: File, actor: ActorContext, config: UploadConfig) {
  const storage = getAdminContentStorage();
  const buffer = Buffer.from(await file.arrayBuffer());
  validateFileSize(buffer.length);
  const { safeName, extension, detectedMime } = validateFileType(file.name, file.type, buffer);
  const uploadId = createId("upload");
  const uploadStoragePath = `uploads/${config.destination}/${batchId}/${uploadId}-${safeName}`;
  await storage.saveBinary(uploadStoragePath, buffer, detectedMime);

  const uploadRecord = {
    id: uploadId,
    batchId,
    originalFilename: file.name,
    normalizedFilename: safeName,
    mimeType: detectedMime,
    extension,
    sizeBytes: buffer.length,
    checksum: sha256(buffer),
    isArchive: extension === ".zip",
    storagePath: uploadStoragePath,
    createdAt: nowIso(),
    extractedFileIds: [] as string[],
    source,
    notes: "",
    uploader: actor.email,
    storageBucket: process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? null,
    contentDestination: config.destination,
  };

  try {
    if (extension === ".zip") {
      const entries = extractZipEntries(buffer);
      const files = entries.map((entry) =>
        createReviewFile(
          batchId,
          uploadId,
          entry.normalizedName,
          entry.name,
          file.name,
          validateFileType(entry.normalizedName, detectedMime, entry.data).detectedMime,
          entry.data,
          source,
          config,
        ),
      );
      uploadRecord.extractedFileIds = files.map((entry) => entry.id);
      return { uploadRecord, files };
    }

    const reviewFile = createReviewFile(batchId, uploadId, safeName, null, null, detectedMime, buffer, source, config);
    uploadRecord.extractedFileIds = [reviewFile.id];
    return { uploadRecord, files: [reviewFile] };
  } catch (error) {
    await storage.deleteBinary(uploadStoragePath);
    throw error;
  }
}

export async function createUploadBatch(request: Request, actor: ActorContext, formData: FormData) {
  const limited = checkRateLimit(
    getRateLimitKey("admin-upload", request),
    DEFAULT_UPLOAD_RATE_LIMIT.maxRequests,
    DEFAULT_UPLOAD_RATE_LIMIT.windowMs,
  );
  if (!limited.allowed) {
    throw new Error("Upload rate limit exceeded");
  }

  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) {
    throw new Error("Select at least one file to upload.");
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  validateBatchSize(totalBytes);

  const name = String(formData.get("batchName") || "Content upload").trim();
  const source = String(formData.get("source") || "manual-upload").trim() || "manual-upload";
  const notes = String(formData.get("notes") || "").trim();
  const uploadConfig = parseUploadConfig(formData);
  const batchId = createId("batch");
  const timestamp = nowIso();
  const batch: UploadBatch = {
    id: batchId,
    name,
    slug: slugify(name),
    source,
    notes,
    status: "processing",
    createdAt: timestamp,
    updatedAt: timestamp,
    uploads: [],
    files: [],
    auditHistory: [],
    exports: [],
    warnings: [],
  };

  const storage = getAdminContentStorage();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "batch-created", result: "success", actor: actor.email, batchId }));

  for (const file of files) {
    try {
      const processed = await processUploadFile(batchId, source, file, actor, uploadConfig);
      batch.uploads.push(processed.uploadRecord);
      batch.files.push(...processed.files);
      await appendBatchAuditEvent(
        batch,
        createAuditEvent({
          action: "file-uploaded",
          result: "success",
          actor: actor.email,
          batchId,
          metadata: { file: file.name, reviewableFiles: processed.files.length },
        }),
      );
      if (processed.uploadRecord.isArchive) {
        await appendBatchAuditEvent(
          batch,
          createAuditEvent({
            action: "archive-extracted",
            result: "success",
            actor: actor.email,
            batchId,
            metadata: { archive: file.name, extractedFiles: processed.files.length },
          }),
        );
      }
    } catch (error) {
      batch.warnings.push(`${file.name}: ${(error as Error).message}`);
      await appendBatchAuditEvent(
        batch,
        createAuditEvent({
          action: "extraction-failure",
          result: "warning",
          actor: actor.email,
          batchId,
          metadata: { file: file.name, error: (error as Error).message },
        }),
      );
    }
  }

  const existingFiles = await listExistingFiles();
  batch.files = batch.files.map((file) => {
    const conflictStatus = detectConflicts(file, existingFiles.filter((candidate) => candidate.batchId !== batchId));
    const nextFile = {
      ...file,
      conflictStatus,
      duplicateStatus: toDuplicateStatus(conflictStatus, file.processingStatus === "error"),
      updatedAt: nowIso(),
    };
    return nextFile;
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  try {
    await storage.createBatch(batch);
  } catch (error) {
    await Promise.allSettled(batch.uploads.map((upload) => storage.deleteBinary(upload.storagePath)));
    throw error;
  }
  return batch;
}

/** Metadata describing a single file that was already uploaded directly to storage. */
export type StoredUploadEntry = {
  uploadId: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
};

/**
 * Finalize an upload batch whose files were already written directly to storage
 * (via signed Supabase upload URLs).  Reads each file from storage, validates
 * it, extracts ZIP contents, and creates the review batch — without requiring
 * the file bytes to pass through the Netlify serverless function request body.
 *
 * This is the server-side counterpart to the two-phase upload flow that
 * bypasses Netlify's 6 MB function request-body limit.
 */
export async function createUploadBatchFromStoredFiles(
  request: Request,
  actor: ActorContext,
  params: {
    batchId: string;
    batchName: string;
    source: string;
    notes: string;
    uploadConfig: UploadConfig;
    uploads: StoredUploadEntry[];
  },
) {
  const limited = checkRateLimit(
    getRateLimitKey("admin-upload", request),
    DEFAULT_UPLOAD_RATE_LIMIT.maxRequests,
    DEFAULT_UPLOAD_RATE_LIMIT.windowMs,
  );
  if (!limited.allowed) throw new Error("Upload rate limit exceeded");

  const { batchId, uploads, uploadConfig } = params;
  if (!uploads.length) throw new Error("No uploaded files were provided.");

  const name = (params.batchName || "Content upload").trim();
  const source = (params.source || "manual-upload").trim() || "manual-upload";
  const notes = (params.notes || "").trim();
  const timestamp = nowIso();

  const batch: UploadBatch = {
    id: batchId,
    name,
    slug: slugify(name),
    source,
    notes,
    status: "processing",
    createdAt: timestamp,
    updatedAt: timestamp,
    uploads: [],
    files: [],
    auditHistory: [],
    exports: [],
    warnings: [],
  };

  const storage = getAdminContentStorage();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "batch-created", result: "success", actor: actor.email, batchId }));

  for (const upload of uploads) {
    try {
      const buffer = await storage.readBinary(upload.storagePath);
      if (!buffer) throw new Error(`File not found in storage after upload: ${upload.originalFilename}`);

      validateFileSize(buffer.length);
      const { safeName, extension, detectedMime } = validateFileType(upload.originalFilename, upload.mimeType, buffer);

      const uploadRecord = {
        id: upload.uploadId,
        batchId,
        originalFilename: upload.originalFilename,
        normalizedFilename: safeName,
        mimeType: detectedMime,
        extension,
        sizeBytes: buffer.length,
        checksum: sha256(buffer),
        isArchive: extension === ".zip",
        storagePath: upload.storagePath,
        createdAt: nowIso(),
        extractedFileIds: [] as string[],
        source,
        notes: "",
        uploader: actor.email,
        storageBucket: process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? null,
        contentDestination: uploadConfig.destination,
      };

      if (extension === ".zip") {
        const entries = extractZipEntries(buffer);
        const files = entries.map((entry) =>
          createReviewFile(
            batchId,
            upload.uploadId,
            entry.normalizedName,
            entry.name,
            upload.originalFilename,
            validateFileType(entry.normalizedName, detectedMime, entry.data).detectedMime,
            entry.data,
            source,
            uploadConfig,
          ),
        );
        uploadRecord.extractedFileIds = files.map((f) => f.id);
        batch.uploads.push(uploadRecord);
        batch.files.push(...files);
        await appendBatchAuditEvent(
          batch,
          createAuditEvent({
            action: "file-uploaded",
            result: "success",
            actor: actor.email,
            batchId,
            metadata: { file: upload.originalFilename, reviewableFiles: files.length },
          }),
        );
        await appendBatchAuditEvent(
          batch,
          createAuditEvent({
            action: "archive-extracted",
            result: "success",
            actor: actor.email,
            batchId,
            metadata: { archive: upload.originalFilename, extractedFiles: files.length },
          }),
        );
      } else {
        const reviewFile = createReviewFile(batchId, upload.uploadId, safeName, null, null, detectedMime, buffer, source, uploadConfig);
        uploadRecord.extractedFileIds = [reviewFile.id];
        batch.uploads.push(uploadRecord);
        batch.files.push(reviewFile);
        await appendBatchAuditEvent(
          batch,
          createAuditEvent({
            action: "file-uploaded",
            result: "success",
            actor: actor.email,
            batchId,
            metadata: { file: upload.originalFilename, reviewableFiles: 1 },
          }),
        );
      }
    } catch (error) {
      batch.warnings.push(`${upload.originalFilename}: ${(error as Error).message}`);
      await appendBatchAuditEvent(
        batch,
        createAuditEvent({
          action: "extraction-failure",
          result: "warning",
          actor: actor.email,
          batchId,
          metadata: { file: upload.originalFilename, error: (error as Error).message },
        }),
      );
    }
  }

  const existingFiles = await listExistingFiles();
  batch.files = batch.files.map((file) => {
    const conflictStatus = detectConflicts(file, existingFiles.filter((candidate) => candidate.batchId !== batchId));
    return {
      ...file,
      conflictStatus,
      duplicateStatus: toDuplicateStatus(conflictStatus, file.processingStatus === "error"),
      updatedAt: nowIso(),
    };
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  try {
    await storage.createBatch(batch);
  } catch (error) {
    // Roll back orphaned storage objects on batch-save failure.
    await Promise.allSettled(batch.uploads.map((u) => storage.deleteBinary(u.storagePath)));
    throw error;
  }
  return batch;
}

export async function listUploadBatches() {
  return getAdminContentStorage().listBatches();
}

export async function getUploadBatch(batchId: string) {
  return getAdminContentStorage().getBatch(batchId);
}

export async function updateBatchMetadata(batchId: string, actor: ActorContext, updates: Partial<Pick<UploadBatch, "name" | "source" | "notes">>) {
  const storage = getAdminContentStorage();
  const batch = await storage.getBatch(batchId);
  if (!batch) throw new Error("Batch not found");
  if (updates.name) batch.name = updates.name.trim();
  if (updates.source) batch.source = updates.source.trim();
  if (typeof updates.notes === "string") batch.notes = updates.notes;
  batch.slug = slugify(batch.name);
  batch.updatedAt = nowIso();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "classification-changed", result: "success", actor: actor.email, batchId, metadata: { scope: "batch" } }));
  await storage.updateBatch(batch);
  return batch;
}

export async function updateBatchFile(batchId: string, fileId: string, actor: ActorContext, updates: Partial<ExtractedFile>) {
  const storage = getAdminContentStorage();
  const batch = await storage.getBatch(batchId);
  if (!batch) throw new Error("Batch not found");
  const index = batch.files.findIndex((file) => file.id === fileId);
  if (index < 0) throw new Error("File not found");
  const current = batch.files[index];
  const classification = updates.classification
    ? {
        ...current.classification,
        ...updates.classification,
        destination: verifyDestinationPath(updates.classification.destination ?? current.classification.destination),
      }
    : current.classification;
  const metadata = updates.metadata
    ? {
        ...current.metadata,
        ...updates.metadata,
        intendedDestination: updates.metadata.intendedDestination
          ? verifyDestinationPath(updates.metadata.intendedDestination)
          : current.metadata.intendedDestination,
      }
    : current.metadata;
  batch.files[index] = {
    ...current,
    ...updates,
    classification,
    metadata,
    updatedAt: nowIso(),
  };
  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "classification-changed", result: "success", actor: actor.email, batchId, fileId }));
  await storage.updateBatch(batch);
  return batch.files[index];
}

export async function bulkReview(batchId: string, actor: ActorContext, fileIds: string[], reviewStatus: "approved" | "rejected") {
  const storage = getAdminContentStorage();
  const batch = await storage.getBatch(batchId);
  if (!batch) throw new Error("Batch not found");
  const touched = new Set(fileIds);
  batch.files = batch.files.map((file) => {
    if (!touched.has(file.id)) return file;
    return {
      ...file,
      reviewStatus,
      approvedAt: reviewStatus === "approved" ? nowIso() : file.approvedAt,
      rejectedAt: reviewStatus === "rejected" ? nowIso() : file.rejectedAt,
      metadata: { ...file.metadata, publicationStatus: reviewStatus === "approved" ? "approved" : "rejected" },
      updatedAt: nowIso(),
    };
  });
  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "bulk-action", result: "success", actor: actor.email, batchId, metadata: { reviewStatus, fileCount: fileIds.length } }));
  await storage.updateBatch(batch);
  return batch;
}

export async function exportBatch(batchId: string, actor: ActorContext) {
  const storage = getAdminContentStorage();
  const batch = await storage.getBatch(batchId);
  if (!batch) throw new Error("Batch not found");
  batch.status = "exporting";
  batch.updatedAt = nowIso();
  const exportPackage = await createExportPackage(batch);
  batch.exports.unshift(exportPackage);
  batch.status = "exported";
  batch.updatedAt = nowIso();
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "export-generated", result: "success", actor: actor.email, batchId, metadata: { exportId: exportPackage.id } }));
  await storage.updateBatch(batch);
  return exportPackage;
}

export async function exportBatchToGithub(batchId: string, actor: ActorContext) {
  const storage = getAdminContentStorage();
  const batch = await storage.getBatch(batchId);
  if (!batch) throw new Error("Batch not found");
  const latestExport = batch.exports[0] ?? (await exportBatch(batchId, actor));
  const github = await createGithubPullRequest(batch, latestExport);
  latestExport.github = github;
  batch.exports[0] = latestExport;
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "github-branch-created", result: "success", actor: actor.email, batchId, metadata: { branch: github.branch } }));
  await appendBatchAuditEvent(batch, createAuditEvent({ action: "github-pr-opened", result: "success", actor: actor.email, batchId, metadata: { url: github.pullRequestUrl } }));
  await storage.updateBatch(batch);
  return github;
}

export async function getExportArchive(batchId: string, exportId: string) {
  const batch = await getAdminContentStorage().getBatch(batchId);
  const exportPackage = batch?.exports.find((entry) => entry.id === exportId);
  if (!exportPackage) throw new Error("Export not found");
  return getAdminContentStorage().readBinary(exportPackage.storagePath);
}

export async function listAuditHistory(batchId?: string) {
  return getAdminContentStorage().listAuditHistory(batchId);
}
