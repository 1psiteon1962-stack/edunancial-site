import { extname } from "node:path";

import { appendBatchAuditEvent } from "@/lib/admin-content/audit";
import { createAuditEvent } from "@/lib/admin-content/auth";
import { classifyFile } from "@/lib/admin-content/classification/classify";
import { DEFAULT_UPLOAD_RATE_LIMIT } from "@/lib/admin-content/config";
import { extractPreview } from "@/lib/admin-content/extractors";
import { resolvePackageUploadConfig } from "@/lib/admin-content/package-upload-config";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import { deriveBatchStatus, toDuplicateStatus } from "@/lib/admin-content/review";
import {
  assertValidUploadName,
  extractZipEntries,
  validateFileSize,
  validateFileType,
} from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type {
  ActorContext,
  ExtractedFile,
  FileMetadataRecord,
  UploadBatch,
} from "@/lib/admin-content/types";
import {
  buildIntendedDestination,
  toAcademyLevel,
  type UploadConfig,
} from "@/lib/admin-content/upload-intake";
import {
  createId,
  encodeBase64,
  normalizeSimilarityText,
  nowIso,
  sha256,
  slugify,
} from "@/lib/admin-content/utils";
import type { StoredUploadEntry } from "@/lib/admin-content/service";

function defaultMetadata(
  batchId: string,
  source: string,
  title: string,
  checksum: string,
): FileMetadataRecord {
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
  const batches = await Promise.all(
    summaries.slice(0, 50).map((summary) => storage.getBatch(summary.id)),
  );
  return batches.flatMap((batch) => batch?.files ?? []);
}

function detectConflicts(current: ExtractedFile, existingFiles: ExtractedFile[]) {
  for (const existing of existingFiles) {
    if (existing.checksum === current.checksum) return "exact-duplicate" as const;
    if (
      existing.classification.destination === current.classification.destination &&
      existing.checksum !== current.checksum
    ) {
      return "destination-conflict" as const;
    }
    if (
      existing.normalizedFilename === current.normalizedFilename &&
      existing.checksum !== current.checksum
    ) {
      return "revision" as const;
    }
    if (
      current.rawText &&
      existing.rawText &&
      normalizeSimilarityText(current.rawText).slice(0, 200) ===
        normalizeSimilarityText(existing.rawText).slice(0, 200)
    ) {
      return "probable-duplicate" as const;
    }
    if (
      existing.normalizedFilename === current.normalizedFilename &&
      (existing.metadata.pillar !== current.metadata.pillar ||
        existing.metadata.academyLevel !== current.metadata.academyLevel)
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
  const destination = buildIntendedDestination(config, normalizedFilename, uploadId);

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
      destination,
      confidence: 1,
      reasons: [`explicit-destination:${config.destination}`, "package-specific-config"],
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
      category:
        config.destination === "courses" ? ("courses" as const) : classification.category,
      language: config.language,
      academyLevel:
        config.destination === "courses"
          ? toAcademyLevel(config.level)
          : classification.academyLevel,
      destination,
      pillar:
        config.destination === "courses" ? config.track : classification.pillar,
      reasons: [...classification.reasons, "package-specific-config"],
    },
    metadata: {
      ...baseFile.metadata,
      title: config.title || normalizedFilename,
      description: config.description,
      language: config.language,
      contentType:
        config.destination === "courses" ? "courses" : classification.category,
      pillar:
        config.destination === "courses" ? config.track : classification.pillar,
      academyLevel:
        config.destination === "courses"
          ? toAcademyLevel(config.level)
          : classification.academyLevel,
      intendedDestination: destination,
      publicationStatus: config.publicationStatus,
    },
  } satisfies ExtractedFile;
}

/**
 * Production finalizer for files already uploaded directly to object storage.
 * Curriculum packages are classified from their own archive filenames before
 * any review file is constructed, so one ZIP can never inherit another ZIP's
 * color, level, language, title, or destination.
 */
export async function createIndependentUploadBatchFromStoredFiles(
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
  await appendBatchAuditEvent(
    batch,
    createAuditEvent({
      action: "batch-created",
      result: "success",
      actor: actor.email,
      batchId,
    }),
  );

  for (const upload of uploads) {
    try {
      // Resolve the package identity BEFORE reading/extracting it. For
      // marketplace uploads this simply returns the original batch config.
      const packageUploadConfig = resolvePackageUploadConfig(
        uploadConfig,
        upload.originalFilename,
      );

      const buffer = await storage.readBinary(upload.storagePath);
      if (!buffer) {
        throw new Error(
          `File not found in storage after upload: ${upload.originalFilename}`,
        );
      }

      validateFileSize(buffer.length);
      const { safeName, extension, detectedMime } = validateFileType(
        upload.originalFilename,
        upload.mimeType,
        buffer,
      );

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
        storageBucket:
          process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ??
          process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ??
          null,
        contentDestination: packageUploadConfig.destination,
      };

      let reviewFiles: ExtractedFile[];
      if (extension === ".zip") {
        const entries = extractZipEntries(buffer);
        reviewFiles = entries.map((entry) =>
          createReviewFile(
            batchId,
            upload.uploadId,
            entry.normalizedName,
            entry.name,
            upload.originalFilename,
            validateFileType(entry.normalizedName, detectedMime, entry.data).detectedMime,
            entry.data,
            source,
            packageUploadConfig,
          ),
        );
      } else {
        reviewFiles = [
          createReviewFile(
            batchId,
            upload.uploadId,
            safeName,
            null,
            null,
            detectedMime,
            buffer,
            source,
            packageUploadConfig,
          ),
        ];
      }

      uploadRecord.extractedFileIds = reviewFiles.map((file) => file.id);
      batch.uploads.push(uploadRecord);
      batch.files.push(...reviewFiles);

      await appendBatchAuditEvent(
        batch,
        createAuditEvent({
          action: "file-uploaded",
          result: "success",
          actor: actor.email,
          batchId,
          metadata: {
            file: upload.originalFilename,
            reviewableFiles: reviewFiles.length,
            packageTrack:
              packageUploadConfig.destination === "courses"
                ? packageUploadConfig.track
                : null,
            packageLevel:
              packageUploadConfig.destination === "courses"
                ? packageUploadConfig.level
                : null,
            packageLanguage: packageUploadConfig.language,
          },
        }),
      );

      if (extension === ".zip") {
        await appendBatchAuditEvent(
          batch,
          createAuditEvent({
            action: "archive-extracted",
            result: "success",
            actor: actor.email,
            batchId,
            metadata: {
              archive: upload.originalFilename,
              extractedFiles: reviewFiles.length,
            },
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
          metadata: {
            file: upload.originalFilename,
            error: (error as Error).message,
          },
        }),
      );
    }
  }

  const existingFiles = await listExistingFiles();
  batch.files = batch.files.map((file) => {
    const conflictStatus = detectConflicts(
      file,
      existingFiles.filter((candidate) => candidate.batchId !== batchId),
    );
    return {
      ...file,
      conflictStatus,
      duplicateStatus: toDuplicateStatus(
        conflictStatus,
        file.processingStatus === "error",
      ),
      updatedAt: nowIso(),
    };
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  try {
    await storage.createBatch(batch);
  } catch (error) {
    await Promise.allSettled(
      batch.uploads.map((upload) => storage.deleteBinary(upload.storagePath)),
    );
    throw error;
  }

  return batch;
}
