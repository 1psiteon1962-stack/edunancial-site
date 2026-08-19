/**
 * POST /api/admin/content/upload/presign
 *
 * Signed uploads are preferred, but failure to create a signed URL must not
 * disable the previously working server-proxied upload path for small files.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_UPLOAD_RATE_LIMIT } from "@/lib/admin-content/config";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import { assertValidUploadName } from "@/lib/admin-content/security";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";
import { createId, slugify } from "@/lib/admin-content/utils";

type FileDescriptor = { name: string; size: number; type: string };
export const maxDuration = 26;

async function checkSupabaseConnectivity(): Promise<void> {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/u, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const checkKey = serviceRoleKey || anonKey;
  const bucket = process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? "";

  if (supabaseUrl && checkKey && bucket) {
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + checkKey, apikey: checkKey },
      cache: "no-store",
    }).catch(() => null);

    if (!response) {
      console.warn("[presign] Supabase connectivity check failed; signed upload may be unavailable and legacy fallback will be used.");
      return;
    }
    if ((response.headers.get("content-type") ?? "").toLowerCase().includes("text/html")) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured or points to the wrong host/Netlify site URL; the Supabase bucket endpoint returned text/html.");
    }
  }
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;

    const limited = checkRateLimit(getRateLimitKey("admin-upload", request), DEFAULT_UPLOAD_RATE_LIMIT.maxRequests, DEFAULT_UPLOAD_RATE_LIMIT.windowMs);
    if (!limited.allowed) throw new Error("Upload rate limit exceeded");

    const body = (await request.json()) as Record<string, unknown> & { files?: unknown };
    const fileDescriptors: FileDescriptor[] = Array.isArray(body.files) ? (body.files as FileDescriptor[]) : [];
    if (!fileDescriptors.length) throw new Error("Select at least one file to upload.");

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key !== "files" && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    }
    parseUploadConfig(configFormData);
    await checkSupabaseConnectivity();

    const batchName = (String(body.batchName ?? "") || "Content Upload " + new Date().toISOString().slice(0, 10)).trim();
    batchId = createId("batch");
    const batchSlug = slugify(batchName);
    const contentDestination = String(body.contentDestination ?? "").trim() || "uploads";

    await recordUploadOperation({ batchId, phase: "PRESIGN", status: "STARTED", metadata: { fileCount: fileDescriptors.length, contentDestination } });

    const uploads = await Promise.all(fileDescriptors.map(async (file) => {
      const uploadId = createId("upload");
      const safeName = assertValidUploadName(file.name);
      const storagePath = "uploads/" + contentDestination + "/" + batchId + "/" + uploadId + "-" + safeName;
      let signedUrl: string | null = null;
      try {
        signedUrl = await createAdminSignedUploadUrl(storagePath);
        await recordUploadOperation({ batchId, uploadId, phase: "PRESIGN", status: "SUCCEEDED", storagePath, fileName: safeName, fileSize: file.size });
      } catch (error) {
        const err = error as Error;
        console.warn(`[presign] signed upload unavailable for ${storagePath}; legacy fallback enabled`, error);
        await recordUploadOperation({ batchId, uploadId, phase: "PRESIGN", status: "FALLBACK", storagePath, fileName: safeName, fileSize: file.size, errorCode: err.name, errorMessage: err.message });
      }
      return { uploadId, storagePath, safeName, signedUrl, directUpload: null };
    }));

    return Response.json({ success: true, batchId, batchSlug, uploads }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "PRESIGN", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    const body: Record<string, unknown> = { success: false, error: err.message ?? "Presign failed.", reason: err.name ?? "UnknownError", status: 400 };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
