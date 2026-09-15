import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { autoPublishTrustedCanonicalCurriculumBatch } from "@/lib/admin-content/trusted-canonical-ingest";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId } from "@/lib/admin-content/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RecoveryCandidate = { batchId: string; upload: StoredUploadEntry };

async function getRecoverableUploads(): Promise<RecoveryCandidate[]> {
  const storage = getAdminContentStorage();
  const [entries, summaries] = await Promise.all([storage.listWorkspaceEntries(), storage.listBatches()]);
  const batches = await Promise.all(summaries.map((summary) => storage.getBatch(summary.id)));
  const claimed = new Set(batches.flatMap((batch) => batch?.uploads.map((upload) => upload.storagePath) ?? []));
  const candidates: RecoveryCandidate[] = [];
  const seen = new Set<string>();
  for (const storagePath of entries) {
    if (!storagePath.startsWith("uploads/courses/") || !storagePath.toLowerCase().endsWith(".zip")) continue;
    if (claimed.has(storagePath) || seen.has(storagePath)) continue;
    const match = storagePath.match(/^uploads\/courses\/(batch_[^/]+)\/(upload_[0-9a-f-]+)-(.+\.zip)$/iu);
    if (!match) continue;
    const [, batchId, uploadId, originalFilename] = match;
    seen.add(storagePath);
    candidates.push({ batchId, upload: { uploadId, originalFilename, mimeType: "application/zip", sizeBytes: 0, storagePath } });
  }
  return candidates;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  try {
    const candidates = await getRecoverableUploads();
    const grouped = new Map<string, StoredUploadEntry[]>();
    for (const candidate of candidates) grouped.set(candidate.batchId, [...(grouped.get(candidate.batchId) ?? []), candidate.upload]);
    return Response.json({ success: true, recoverable: Array.from(grouped, ([batchId, uploads]) => ({ batchId, uploads })), recoveryAvailable: true, discoverySource: "persistent-storage" }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: true, recoverable: [], recoveryAvailable: false, warning: "Interrupted-upload recovery could not inspect persistent upload storage.", error: error instanceof Error ? error.message : String(error) }, { headers: { "Cache-Control": "private, no-store" } });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  const actor = toActor(auth.session);
  const body = await request.json() as { batchId?: string; uploadId?: string };
  const batchId = String(body.batchId ?? "").trim();
  const uploadId = String(body.uploadId ?? "").trim();
  if (!batchId || !uploadId) return Response.json({ success: false, error: "batchId and uploadId are required." }, { status: 400 });
  let candidates: RecoveryCandidate[];
  try { candidates = await getRecoverableUploads(); } catch (error) { return Response.json({ success: false, error: "Persistent upload storage could not be inspected.", detail: error instanceof Error ? error.message : String(error) }, { status: 503 }); }
  const candidate = candidates.find((entry) => entry.batchId === batchId && entry.upload.uploadId === uploadId);
  if (!candidate) return Response.json({ success: false, error: "Stored upload is unavailable, already finalized, or already recovered." }, { status: 404 });
  const upload = candidate.upload;
  let identity;
  try { identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US"); } catch (error) { return Response.json({ success: false, error: (error as Error).message }, { status: 400 }); }
  const recoveryBatchId = createId("batch");
  const batch = await createIndependentUploadBatchFromStoredFiles(request, actor, { batchId: recoveryBatchId, batchName: `Recovered ${upload.originalFilename}`, source: `Recovered from stored upload batch ${batchId}`, notes: "Recovered from persistent upload storage after finalization was interrupted. No file was re-uploaded.", uploadConfig: { destination: "courses", track: identity.track, level: identity.level, language: identity.language, membershipAccess: "basic", publicationStatus: "draft", title: identity.title, description: "Recovered curriculum ZIP package." }, uploads: [upload] });
  if (batch.uploads.length === 0 || batch.files.length === 0) return Response.json({ success: false, error: "The stored object could not be processed. It may not have completed transfer." }, { status: 409 });
  const trustedCanonicalPublication = await autoPublishTrustedCanonicalCurriculumBatch(batch, identity, actor);
  await recordUploadOperation({ batchId, uploadId, phase: "VERIFY", status: "SUCCEEDED", storagePath: upload.storagePath, fileName: upload.originalFilename, fileSize: upload.sizeBytes, metadata: { recoveryBatchId, recoveredWithoutReupload: true, trustedCanonicalPublication, discoverySource: "persistent-storage" } });
  return Response.json({ success: true, originalBatchId: batchId, recoveredUploadId: uploadId, batch, trustedCanonicalPublication }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
