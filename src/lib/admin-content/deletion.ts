import { DEFAULT_BULK_DELETE_LIMIT, DEFAULT_FAILED_BATCH_DELETE_LIMIT, WORKSPACE_CLEAR_CONFIRMATION } from "@/lib/admin-content/config";
import { appendGlobalAuditEvent } from "@/lib/admin-content/audit";
import { createAuditEvent } from "@/lib/admin-content/auth";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { assertSafeWorkspacePath, assertValidEntityId } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, UploadBatch } from "@/lib/admin-content/types";
import { nowIso } from "@/lib/admin-content/utils";

const PROTECTED_WORKSPACE_PATHS = new Set(["audit.json"]);

type DeleteAttempt = { path: string; ok: boolean; error?: string };

export type DeleteOutcome = {
  deleted: number;
  skipped: number;
  failures: DeleteAttempt[];
};

export type BatchDeleteResult = {
  batchId: string;
  deletedFileIds: string[];
  deletedPaths: string[];
  storageOutcome: DeleteOutcome;
};

export type BulkDeleteResult = {
  requested: number;
  deleted: number;
  skipped: number;
  failures: Array<{ id: string; error: string }>;
};

export type WorkspaceOrphanScan = {
  scannedPaths: number;
  referencedPaths: number;
  orphanPaths: string[];
};

function summarizeDeleteResults(paths: string[], settled: PromiseSettledResult<void>[]): DeleteOutcome {
  const failures: DeleteAttempt[] = [];
  let deleted = 0;
  let skipped = 0;
  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      deleted += 1;
      return;
    }
    const message = result.reason instanceof Error ? result.reason.message : String(result.reason);
    if (/404|not found|NoSuchKey/i.test(message)) {
      skipped += 1;
      return;
    }
    failures.push({ path: paths[index] ?? "unknown", ok: false, error: message });
  });
  return { deleted, skipped, failures };
}

function collectBatchArtifactPaths(batch: UploadBatch) {
  const paths = new Set<string>([
    `batches/${batch.id}.json`,
    ...batch.uploads.map((upload) => upload.storagePath),
  ]);
  for (const exportPackage of batch.exports) {
    paths.add(exportPackage.storagePath);
    paths.add(exportPackage.manifestPath);
    paths.add(exportPackage.auditSummaryPath);
    paths.add(exportPackage.warningsPath);
    paths.add(exportPackage.rejectedFilesPath);
    paths.add(`exports/${exportPackage.id}.json`);
  }
  return [...paths].map(assertSafeWorkspacePath);
}

function assertDeleteLimit(ids: string[], limit = DEFAULT_BULK_DELETE_LIMIT) {
  if (ids.length > limit) {
    throw new Error(`Delete request exceeds maximum size (${limit}).`);
  }
}

function normalizeUniqueIds(ids: string[], label: string) {
  return [...new Set(ids.map((entry) => assertValidEntityId(String(entry), label)))];
}

async function deleteWorkspacePaths(paths: string[]) {
  const storage = getAdminContentStorage();
  const safePaths = paths.map(assertSafeWorkspacePath);
  const settled = await Promise.allSettled(safePaths.map((path) => storage.deleteBinary(path)));
  return summarizeDeleteResults(safePaths, settled);
}

export async function deleteBatch(batchId: string, actor: ActorContext, options?: { allowExported?: boolean }) {
  const storage = getAdminContentStorage();
  const normalizedBatchId = assertValidEntityId(batchId, "batch");
  const batch = await storage.getBatch(normalizedBatchId);
  if (!batch) throw new Error("Batch not found.");
  if (batch.exports.length > 0 && !options?.allowExported) {
    throw new Error("Batch has exports. Explicit exported-batch confirmation is required.");
  }

  const artifactPaths = collectBatchArtifactPaths(batch);
  const storageOutcome = await deleteWorkspacePaths(artifactPaths);

  await storage.removeBatch(normalizedBatchId);
  const summaries = await storage.listBatches();
  await storage.updateBatchIndex(summaries.filter((entry) => entry.id !== normalizedBatchId));

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "content_batch_deleted",
      result: storageOutcome.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      batchId: normalizedBatchId,
      metadata: {
        exported: batch.exports.length > 0,
        exports: batch.exports.map((entry) => ({
          exportId: entry.id,
          branch: entry.github?.branch ?? null,
          pullRequestUrl: entry.github?.pullRequestUrl ?? null,
          pullRequestNumber: entry.github?.pullRequestNumber ?? null,
          commitSha: (entry.github as { commitSha?: string } | undefined)?.commitSha ?? null,
        })),
        deletedArtifacts: storageOutcome.deleted,
        skippedArtifacts: storageOutcome.skipped,
        failedArtifacts: storageOutcome.failures.length,
      },
    }),
  );

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "content_batch_purged",
      result: storageOutcome.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      batchId: normalizedBatchId,
      metadata: { hardDelete: true },
    }),
  );

  return {
    batchId: normalizedBatchId,
    deletedFileIds: batch.files.map((file) => file.id),
    deletedPaths: artifactPaths,
    storageOutcome,
  } satisfies BatchDeleteResult;
}

export async function deleteBatchFile(batchId: string, fileId: string, actor: ActorContext) {
  const storage = getAdminContentStorage();
  const normalizedBatchId = assertValidEntityId(batchId, "batch");
  const normalizedFileId = assertValidEntityId(fileId, "file");
  const batch = await storage.getBatch(normalizedBatchId);
  if (!batch) throw new Error("Batch not found.");

  const fileIndex = batch.files.findIndex((entry) => entry.id === normalizedFileId);
  if (fileIndex < 0) throw new Error("File not found.");
  const file = batch.files[fileIndex];

  batch.files.splice(fileIndex, 1);
  const upload = batch.uploads.find((entry) => entry.id === file.uploadId);
  const artifactsToDelete: string[] = [];
  if (upload) {
    upload.extractedFileIds = upload.extractedFileIds.filter((entry) => entry !== normalizedFileId);
    if (upload.extractedFileIds.length === 0) {
      artifactsToDelete.push(upload.storagePath);
      batch.uploads = batch.uploads.filter((entry) => entry.id !== upload.id);
    }
  }

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  await storage.updateBatch(batch);

  const storageOutcome = await deleteWorkspacePaths(artifactsToDelete);
  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "content_file_deleted",
      result: storageOutcome.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      batchId: normalizedBatchId,
      fileId: normalizedFileId,
      metadata: {
        filename: file.normalizedFilename,
        uploadId: file.uploadId,
        batchTotals: {
          totalFiles: batch.files.length,
          approvedFiles: batch.files.filter((entry) => entry.reviewStatus === "approved").length,
          rejectedFiles: batch.files.filter((entry) => entry.reviewStatus === "rejected").length,
          pendingFiles: batch.files.filter((entry) => entry.reviewStatus === "pending").length,
        },
      },
    }),
  );

  return {
    batch,
    fileId: normalizedFileId,
    deletedArtifactPaths: artifactsToDelete,
    storageOutcome,
  };
}

export async function bulkDeleteBatchFiles(batchId: string, fileIds: string[], actor: ActorContext) {
  const normalizedBatchId = assertValidEntityId(batchId, "batch");
  const normalizedFileIds = normalizeUniqueIds(fileIds, "file");
  assertDeleteLimit(normalizedFileIds);

  const results = await Promise.allSettled(normalizedFileIds.map((fileId) => deleteBatchFile(normalizedBatchId, fileId, actor)));
  const failures: Array<{ id: string; error: string }> = [];
  let deleted = 0;
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      deleted += 1;
      return;
    }
    failures.push({
      id: normalizedFileIds[index] ?? "unknown",
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    });
  });

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "content_files_bulk_deleted",
      result: failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      batchId: normalizedBatchId,
      metadata: { requested: normalizedFileIds.length, deleted, failed: failures.length },
    }),
  );

  return {
    requested: normalizedFileIds.length,
    deleted,
    skipped: normalizedFileIds.length - deleted - failures.length,
    failures,
  } satisfies BulkDeleteResult;
}

export async function bulkDeleteBatches(batchIds: string[], actor: ActorContext, options?: { allowExported?: boolean }) {
  const normalizedBatchIds = normalizeUniqueIds(batchIds, "batch");
  assertDeleteLimit(normalizedBatchIds);

  const results = await Promise.allSettled(
    normalizedBatchIds.map((id) => deleteBatch(id, actor, { allowExported: options?.allowExported ?? false })),
  );
  const failures: Array<{ id: string; error: string }> = [];
  let deleted = 0;
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      deleted += 1;
      return;
    }
    failures.push({
      id: normalizedBatchIds[index] ?? "unknown",
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    });
  });

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "content_batches_bulk_deleted",
      result: failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      metadata: { requested: normalizedBatchIds.length, deleted, failed: failures.length, allowExported: options?.allowExported ?? false },
    }),
  );

  return {
    requested: normalizedBatchIds.length,
    deleted,
    skipped: normalizedBatchIds.length - deleted - failures.length,
    failures,
  } satisfies BulkDeleteResult;
}

function buildReferencedWorkspacePaths(batches: UploadBatch[]) {
  const paths = new Set<string>(["index.json", "audit.json"]);
  for (const batch of batches) {
    for (const path of collectBatchArtifactPaths(batch)) {
      paths.add(path);
    }
  }
  return paths;
}

export async function scanWorkspaceOrphans(actor?: ActorContext) {
  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const batches = (
    await Promise.all(summaries.map((summary) => storage.getBatch(summary.id)))
  ).filter((entry): entry is UploadBatch => Boolean(entry));

  const referenced = buildReferencedWorkspacePaths(batches);
  const workspaceEntries = (await storage.listWorkspaceEntries()).map(assertSafeWorkspacePath);
  const orphanPaths = workspaceEntries.filter((entry) => !referenced.has(entry) && !PROTECTED_WORKSPACE_PATHS.has(entry));

  if (actor) {
    await appendGlobalAuditEvent(
      createAuditEvent({
        action: "workspace_orphans_scanned",
        result: "success",
        actor: actor.email,
        metadata: {
          scannedPaths: workspaceEntries.length,
          referencedPaths: referenced.size,
          orphanCount: orphanPaths.length,
        },
      }),
    );
  }

  return {
    scannedPaths: workspaceEntries.length,
    referencedPaths: referenced.size,
    orphanPaths,
  } satisfies WorkspaceOrphanScan;
}

export async function deleteWorkspaceOrphans(paths: string[], actor: ActorContext) {
  const safePaths = [...new Set(paths.map(assertSafeWorkspacePath))].filter((path) => !PROTECTED_WORKSPACE_PATHS.has(path));
  assertDeleteLimit(safePaths);
  const storageOutcome = await deleteWorkspacePaths(safePaths);

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "workspace_orphans_deleted",
      result: storageOutcome.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      metadata: {
        requested: safePaths.length,
        deleted: storageOutcome.deleted,
        skipped: storageOutcome.skipped,
        failed: storageOutcome.failures.length,
      },
    }),
  );

  return {
    requested: safePaths.length,
    deleted: storageOutcome.deleted,
    skipped: storageOutcome.skipped,
    failures: storageOutcome.failures.map((entry) => ({ id: entry.path, error: entry.error ?? "Delete failed" })),
  } satisfies BulkDeleteResult;
}

export async function deleteFailedBatches(actor: ActorContext) {
  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const failedBatchIds = summaries
    .filter((summary) => summary.status === "failed")
    .slice(0, DEFAULT_FAILED_BATCH_DELETE_LIMIT)
    .map((summary) => summary.id);

  const result = await bulkDeleteBatches(failedBatchIds, actor, { allowExported: true });
  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "failed_batches_deleted",
      result: result.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      metadata: {
        requested: failedBatchIds.length,
        deleted: result.deleted,
        failed: result.failures.length,
      },
    }),
  );
  return result;
}

export async function clearWorkspace(actor: ActorContext, confirmation: string) {
  if (confirmation.trim() !== WORKSPACE_CLEAR_CONFIRMATION) {
    throw new Error("Workspace clear confirmation text does not match.");
  }

  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const batchDeleteResult = await bulkDeleteBatches(
    summaries.map((summary) => summary.id),
    actor,
    { allowExported: true },
  );

  const orphanScan = await scanWorkspaceOrphans();
  const orphanDeleteResult = await deleteWorkspaceOrphans(orphanScan.orphanPaths, actor);
  await storage.updateBatchIndex([]);

  await appendGlobalAuditEvent(
    createAuditEvent({
      action: "workspace_cleared",
      result: batchDeleteResult.failures.length > 0 || orphanDeleteResult.failures.length > 0 ? "warning" : "success",
      actor: actor.email,
      metadata: {
        deletedBatches: batchDeleteResult.deleted,
        failedBatchDeletes: batchDeleteResult.failures.length,
        deletedOrphans: orphanDeleteResult.deleted,
        failedOrphanDeletes: orphanDeleteResult.failures.length,
      },
    }),
  );

  return {
    confirmationRequired: WORKSPACE_CLEAR_CONFIRMATION,
    batchDeleteResult,
    orphanDeleteResult,
  };
}

export async function getWorkspaceMaintenanceStats() {
  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const orphanScan = await scanWorkspaceOrphans();
  const statusCounts = summaries.reduce<Record<string, number>>((acc, summary) => {
    acc[summary.status] = (acc[summary.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalBatches: summaries.length,
    failedBatches: statusCounts.failed ?? 0,
    exportedBatches: statusCounts.exported ?? 0,
    totalFiles: summaries.reduce((sum, summary) => sum + summary.totalFiles, 0),
    statusCounts,
    workspaceObjectCount: (await storage.listWorkspaceEntries()).length,
    orphanScan,
    clearWorkspaceConfirmation: WORKSPACE_CLEAR_CONFIRMATION,
  };
}

export function getWorkspaceClearConfirmationText() {
  return WORKSPACE_CLEAR_CONFIRMATION;
}
