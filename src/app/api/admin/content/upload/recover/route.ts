import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { inferCurriculumPackageIdentity } from "@/lib/admin-content/package-upload-config";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import type { StoredUploadEntry } from "@/lib/admin-content/service";
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

async function getRecoverableUploads(batchId: string): Promise<StoredUploadEntry[]> {
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("batch_id,upload_id,phase,status,storage_path,file_name,file_size,metadata")
    .eq("batch_id", batchId)
    .eq("phase", "PRESIGN")
    .eq("status", "SUCCEEDED");

  if (error) throw new Error(`Unable to read stored upload audit trail: ${error.message}`);

  const seen = new Set<string>();
  return ((data ?? []) as OperationRow[])
    .filter((row) => row.upload_id && row.storage_path && row.file_name)
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

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("admin_upload_operations")
    .select("batch_id,phase,status,error_message,metadata")
    .eq("phase", "FINALIZE")
    .eq("status", "FAILED")
    .limit(25);

  if (error) return Response.json({ success: false, error: error.message }, { status: 500 });

  const batchIds = Array.from(new Set(((data ?? []) as Array<{ batch_id: string | null }>).map((row) => row.batch_id).filter((value): value is string => Boolean(value))));
  const recoverable = [] as Array<{ batchId: string; uploads: StoredUploadEntry[] }>;
  for (const batchId of batchIds) {
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

  const uploads = await getRecoverableUploads(batchId);
  const upload = uploads.find((entry) => entry.uploadId === uploadId);
  if (!upload) return Response.json({ success: false, error: "Stored upload could not be reconstructed from the audit trail." }, { status: 404 });

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
    notes: "Recovered after the original direct-to-storage upload completed but HTTP finalization timed out. No file was re-uploaded.",
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

  return Response.json({ success: true, originalBatchId: batchId, recoveredUploadId: uploadId, batch }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
