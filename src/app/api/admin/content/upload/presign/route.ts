/**
 * POST /api/admin/content/upload/presign
 *
 * Phase 1 of the two-phase upload flow that bypasses Netlify's 6 MB
 * serverless-function request-body limit.
 *
 * Accepts batch metadata and a list of file descriptors (name / size / type
 * only — no file content).  Returns a storage path and, when
 * SUPABASE_SERVICE_ROLE_KEY is configured, a time-limited signed upload URL
 * for each file so the browser can PUT the bytes directly to Supabase Storage.
 *
 * If signed URLs are unavailable (anon-key-only deployment or local dev) the
 * response sets signedUrl to null and includes a directUpload spec with the
 * anon-key credentials the browser can use instead.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_UPLOAD_RATE_LIMIT } from "@/lib/admin-content/config";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import { assertValidUploadName } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { createDirectUploadSpec } from "@/lib/admin-content/upload-direct";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { createId, slugify } from "@/lib/admin-content/utils";

// Netlify synchronous functions allow up to 26 s; use the maximum to allow
// bucket-existence check on cold-start without timing out.
export const maxDuration = 26;

type FileDescriptor = { name: string; size: number; type: string };

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const limited = checkRateLimit(
      getRateLimitKey("admin-upload", request),
      DEFAULT_UPLOAD_RATE_LIMIT.maxRequests,
      DEFAULT_UPLOAD_RATE_LIMIT.windowMs,
    );
    if (!limited.allowed) throw new Error("Upload rate limit exceeded");

    const body = (await request.json()) as Record<string, unknown> & { files?: unknown };

    const fileDescriptors: FileDescriptor[] = Array.isArray(body.files)
      ? (body.files as FileDescriptor[])
      : [];
    if (!fileDescriptors.length) throw new Error("Select at least one file to upload.");

    // Eagerly validate the upload config so the client gets a clear error
    // before it starts uploading any bytes.
    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key !== "files" && (typeof value === "string" || typeof value === "number")) {
        configFormData.append(key, String(value));
      }
    }
    parseUploadConfig(configFormData);

    const storage = getAdminContentStorage();
    const batchName = (
      String(body.batchName ?? "") || "Content Upload " + new Date().toISOString().slice(0, 10)
    ).trim();
    const batchId = createId("batch");
    const batchSlug = slugify(batchName);
    const contentDestination = String(body.contentDestination ?? "").trim() || "uploads";

    // The anon key is NEXT_PUBLIC — safe to include in API responses for the
    // admin portal, which is already behind session + CSRF guards.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;
    const bucket =
      process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ??
      process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ??
      null;

    const uploads = await Promise.all(
      fileDescriptors.map(async (file) => {
        const uploadId = createId("upload");
        const safeName = assertValidUploadName(file.name);
        const storagePath = "uploads/" + contentDestination + "/" + batchId + "/" + uploadId + "-" + safeName;

        // Try signed URL first (requires SUPABASE_SERVICE_ROLE_KEY on server).
        const signedUrl = await storage.getSignedUploadUrl(storagePath);

        // Fallback: expose anon-key credentials so the browser can upload
        // directly to Supabase without routing file bytes through the Netlify
        // serverless function.
        const directUpload =
          !signedUrl && supabaseUrl && anonKey && bucket
            ? createDirectUploadSpec(supabaseUrl, anonKey, bucket, storagePath)
            : null;

        return {
          uploadId,
          storagePath,
          safeName,
          signedUrl: signedUrl ?? null,
          directUpload,
        };
      }),
    );

    return Response.json({ batchId, batchSlug, uploads });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
