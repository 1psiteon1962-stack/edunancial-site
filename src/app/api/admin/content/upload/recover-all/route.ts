import { NextRequest } from "next/server";

import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { autoPublishTrustedCanonicalCurriculumBatch } from "@/lib/admin-content/trusted-canonical-ingest";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { createId } from "@/lib/admin-content/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type OperationRow = {
  batch_id: string | null;
  upload_id: string | null;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
};

type RecoveryCandidate = {
  originalBatchId: string;
  upload: StoredUploadEntry;
};

function isMissingOperationsTable(message: string) {
  return /admin_upload_operations/u.test(message) && /could not find the table|schema cache|does not exist|relation .* does not exist/iu.test(message);
}

async function authorizeGithubActions(request: NextRequest) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const repository = request.headers.get("x-github-repository") ?? "";
  const runId = request.headers.get("x-github-run-id") ?? "";
  const expected = `${process.env.EDUNANCIAL_GITHUB_OWNER}/${process.env.EDUNANCIAL_GITHUB_REPO}`;
  if (!token || !runId || repository !== expected) return false;

  const response = await fetch(`https://api.github.com/repos/${expected}/actions/runs/${encodeURIComponent(runId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!response.ok) return false;
  const run = await response.json() as { head_branch?: string; event?: string; status?: string; repository?: { full_name?: string } };
  return run.repository?.full_name === expected && run.head_branch === "main" && run.event === "push" && run.status === "in_progress";
}

async function completedUploadIds(batchId: string) {
  const db = getKpiSupabaseAdmin();
  const [{ data: recovered, error: recoveryError }, { data: finalized, error: finalizeError }] = await Promise.all([
    db.from("admin_upload_operations").select("upload_id").eq("batch_id", batchId).eq("phase", "VERIFY").eq("status", "SUCCEEDED"),
    db.from("admin_upload_operations").select("upload_id").eq("batch_id", batchId).eq("phase", "FINALIZE").eq("status", "SUCCEEDED"),
  ]);
  if (recoveryError) throw new Error(recoveryError.message);
  if (finalizeError) throw new Error(finalizeError.message);
  return new Set([...(recovered ?? []), ...(finalized ?? [])].map((row: { upload_id: string | null }) => row.upload_id).filter(Boolean));
}

async function recoverableUploads(batchId: string): Promise<StoredUploadEntry[]> {
  const db = getKpiSupabaseAdmin();
  const [completed, query] = await Promise.all([
    completedUploadIds(batchId),
    db.from("admin_upload_operations").select("batch_id,upload_id,storage_path,file_name,file_size").eq("batch_id", batchId).eq("phase", "PRESIGN").eq("status", "SUCCEEDED"),
  ]);
  if (query.error) throw new Error(query.error.message);
  const seen = new Set<string>();
  return ((query.data ?? []) as OperationRow[])
    .filter((row) => row.upload_id && row.storage_path && row.file_name)
    .filter((row) => !completed.has(row.upload_id as string))
    .filter((row) => {
      const id = row.upload_id as string;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((row) => ({
      uploadId: row.upload_id as string,
      originalFilename: row.file_name as string,
      mimeType: (row.file_name as string).toLowerCase().endsWith(".zip") ? "application/zip" : "application/octet-stream",
      sizeBytes: row.file_size ?? 0,
      storagePath: row.storage_path as string,
    }));
}

async function candidatesFromOperationsTable(): Promise<RecoveryCandidate[]> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db.from("admin_upload_operations")
    .select("batch_id")
    .eq("phase", "FINALIZE")
    .in("status", ["STARTED", "FAILED"])
    .limit(100);
  if (error) throw new Error(error.message);

  const batchIds = Array.from(new Set(((data ?? []) as Array<{ batch_id: string | null }>).map((row) => row.batch_id).filter((value): value is string => Boolean(value))));
  const candidates: RecoveryCandidate[] = [];
  for (const originalBatchId of batchIds) {
    const uploads = await recoverableUploads(originalBatchId);
    for (const upload of uploads) candidates.push({ originalBatchId, upload });
  }
  return candidates;
}

async function candidatesFromStoredObjects(): Promise<RecoveryCandidate[]> {
  const storage = getAdminContentStorage();
  const [entries, summaries] = await Promise.all([storage.listWorkspaceEntries(), storage.listBatches()]);
  const batches = await Promise.all(summaries.map((summary) => storage.getBatch(summary.id)));
  const alreadyClaimed = new Set(
    batches.flatMap((batch) => batch?.uploads.map((upload) => upload.storagePath) ?? []),
  );

  const candidates: RecoveryCandidate[] = [];
  const seen = new Set<string>();
  for (const storagePath of entries) {
    if (!storagePath.startsWith("uploads/courses/") || !storagePath.toLowerCase().endsWith(".zip")) continue;
    if (alreadyClaimed.has(storagePath) || seen.has(storagePath)) continue;
    const match = storagePath.match(/^uploads\/courses\/(batch_[^/]+)\/(upload_[0-9a-f-]+)-(.+\.zip)$/iu);
    if (!match) continue;
    const [, originalBatchId, uploadId, originalFilename] = match;
    seen.add(storagePath);
    candidates.push({
      originalBatchId,
      upload: {
        uploadId,
        originalFilename,
        mimeType: "application/zip",
        sizeBytes: 0,
        storagePath,
      },
    });
  }
  return candidates;
}

async function getRecoveryCandidates(): Promise<{ source: "operations-table" | "stored-objects"; candidates: RecoveryCandidate[] }> {
  try {
    return { source: "operations-table", candidates: await candidatesFromOperationsTable() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!isMissingOperationsTable(message)) throw error;
    return { source: "stored-objects", candidates: await candidatesFromStoredObjects() };
  }
}

export async function POST(request: NextRequest) {
  if (!(await authorizeGithubActions(request))) {
    return Response.json({ success: false, error: "Unauthorized recovery runner." }, { status: 401 });
  }

  const actor = { email: "github-actions-recovery@edunancial.internal" };
  let recovery: { source: "operations-table" | "stored-objects"; candidates: RecoveryCandidate[] };
  try {
    recovery = await getRecoveryCandidates();
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 503 });
  }

  const results: Array<Record<string, unknown>> = [];
  for (const { originalBatchId, upload } of recovery.candidates) {
    try {
      const identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US");
      if (!(["level-2", "level-3"].includes(identity.level) && ["en", "en-US"].includes(identity.language))) {
        results.push({ originalBatchId, uploadId: upload.uploadId, file: upload.originalFilename, skipped: true, reason: "not trusted canonical English L2/L3" });
        continue;
      }
      const recoveryBatchId = createId("batch");
      const batch = await createIndependentUploadBatchFromStoredFiles(request, actor, {
        batchId: recoveryBatchId,
        batchName: `Recovered ${upload.originalFilename}`,
        source: `Recovered from stored upload batch ${originalBatchId}`,
        notes: "One-time automated recovery after interrupted bulk finalization; no file re-uploaded.",
        uploadConfig: {
          destination: "courses",
          track: identity.track,
          level: identity.level,
          language: identity.language,
          membershipAccess: "basic",
          publicationStatus: "draft",
          title: identity.title,
          description: "Recovered curriculum ZIP package.",
        },
        uploads: [upload],
      });
      if (batch.uploads.length === 0 || batch.files.length === 0) throw new Error("Stored object could not be processed.");
      const publication = await autoPublishTrustedCanonicalCurriculumBatch(batch, identity, actor);
      await recordUploadOperation({
        batchId: originalBatchId,
        uploadId: upload.uploadId,
        phase: "VERIFY",
        status: "SUCCEEDED",
        storagePath: upload.storagePath,
        fileName: upload.originalFilename,
        fileSize: upload.sizeBytes,
        metadata: { recoveryBatchId, recoveredWithoutReupload: true, trustedCanonicalPublication: publication, runner: "github-actions", discoverySource: recovery.source },
      });
      results.push({ originalBatchId, recoveryBatchId, uploadId: upload.uploadId, file: upload.originalFilename, success: true, publication });
    } catch (error) {
      results.push({ originalBatchId, uploadId: upload.uploadId, file: upload.originalFilename, success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const failures = results.filter((entry) => entry.success === false);
  return Response.json({ success: failures.length === 0, source: recovery.source, processed: results.length, failures: failures.length, results }, { status: failures.length ? 207 : 200 });
}
