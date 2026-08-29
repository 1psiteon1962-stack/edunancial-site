import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { createId } from "@/lib/admin-content/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type OperationRow = {
  batch_id: string | null;
  upload_id: string | null;
  phase: string;
  status: string;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
  metadata?: Record<string, unknown> | null;
};

async function getRecoveredUploadIds(batchId: string): Promise<Set<string>> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("upload_id")
    .eq("batch_id", batchId)
    .eq("phase", "VERIFY")
    .eq("status", "SUCCEEDED");

  if (error) throw new Error(`Unable to read recovery audit trail: ${error.message}`);
  return new Set(((data ?? []) as Array<{ upload_id: string | null }>).map((row) => row.upload_id).filter((value): value is string => Boolean(value)));
}

async function getRecoverableUploads(batchId: string): Promise<StoredUploadEntry[]> {
  const db = getKpiSupabaseAdmin();
  const [{ data, error }, recoveredIds] = await Promise.all([
    db
      .from("admin_upload_operations")
      .select("batch_id,upload_id,phase,status,storage_path,file_name,file_size,metadata")
      .eq("batch_id", batchId)
      .eq("phase", "PRESIGN")
      .eq("status", "SUCCEEDED"),
    getRecoveredUploadIds(batchId),
  ]);

  if (error) throw new Error(`Unable to read stored upload audit trail: ${error.message}`);

  const seen = new Set<string>();
  return ((data ?? []) as OperationRow[])
    .filter((row) => row.upload_id && row.storage_path && row.file_name)
    .filter((row) => !recoveredIds.has(row.upload_id as string))
    .filter((row) => {
      const key = row.upload_id as string;
      if (seen.has(key)) return false;
      seen.add(key);
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

async function hasSuccessfulFinalization(batchId: string): Promise<boolean> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("batch_id")
    .eq("batch_id", batchId)
    .eq("phase", "FINALIZE")
    .eq("status", "SUCCEEDED")
    .limit(1);
  if (error) throw new Error(`Unable to verify finalization state: ${error.message}`);
  return Boolean(data?.length);
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("batch_id,phase,status,error_message,metadata")
    .eq("phase", "FINALIZE")
    .in("status", ["STARTED", "FAILED"])
    .limit(100);

  if (error) return Response.json({ success: false, error: error.message }, { status: 500 });

  const candidateBatchIds = Array.from(new Set(((data ?? []) as Array<{ batch_id: string | null }>).map((row) => row.batch_id).filter((value): value is string => Boolean(value))));
  const recoverable: Array<{ batchId: string; uploads: StoredUploadEntry[] }> = [];

  for (const batchId of candidateBatchIds) {
    if (await hasSuccessfulFinalization(batchId)) continue;
    const uploads = await getRecoverableUploads(batchId);
    if (uploads.length) recoverable.push({ batchId, uploads });
  }

  return Response.json({ success: true, recoverable }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const body = await request.json() as { batchId?: string; uploadId?: string };
  const batchId = String(body.batchId ?? "").trim();
  const uploadId = String(body.uploadId ?? "").trim();
  if (!batchId || !uploadId) return Response.json({ success: false, error: "batchId and uploadId are required." }, { status: 400 });

  if (await hasSuccessfulFinalization(batchId)) {
    return Response.json({ success: false, error: "This upload batch already finalized successfully and must not be recovered again." }, { status: 409 });
  }

  const uploads = await getRecoverableUploads(batchId);
  const upload = uploads.find((entry) => entry.uploadId === uploadId);
  if (!upload) return Response.json({ success: false, error: "Stored upload is unavailable or has already been recovered." }, { status: 404 });

  let identity;
  try {
    identity = inferCurriculumPackageIdentity(upload.originalFilename, "en-US");
  } catch (error) {
    return Response.json({ success: false, error: (error as Error).message }, { status: 400 });
  }

  const recoveryBatchId = createId("batch");
  const batch = await createIndependentUploadBatchFromStoredFiles(request, toActor(auth.session), {
    batchId: recoveryBatchId,
    batchName: `Recovered ${upload.originalFilename}`,
    source: `Recovered from stored upload batch ${batchId}`,
    notes: "Recovered after the original direct-to-storage upload completed but HTTP finalization was interrupted. No file was re-uploaded.",
    uploadConfig: {
      destination: "courses",
      track: identity.track,
      level: identity.level,
      language: identity.language,
      membershipAccess: "basic",
      publicationStatus: "draft",
      title: identity.title,
      description: "Recovered curriculum ZIP package. Review before publishing.",
    },
    uploads: [upload],
  });

  if (batch.uploads.length === 0 || batch.files.length === 0) {
    return Response.json({ success: false, error: "The audit trail exists, but the stored object could not be processed. It may not have completed transfer." }, { status: 409 });
  }

  await recordUploadOperation({
    batchId,
    uploadId,
    phase: "VERIFY",
    status: "SUCCEEDED",
    storagePath: upload.storagePath,
    fileName: upload.originalFilename,
    fileSize: upload.sizeBytes,
    metadata: { recoveryBatchId, recoveredWithoutReupload: true },
  });

  return Response.json({ success: true, originalBatchId: batchId, recoveredUploadId: uploadId, batch }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
