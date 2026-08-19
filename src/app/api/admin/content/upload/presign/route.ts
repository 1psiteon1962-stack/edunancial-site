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
import { createId, slugify } from "@/lib/admin-content/utils";

type FileDescriptor = { name: string; size: number; type: string };
export const maxDuration = 26;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;

    const limited = checkRateLimit(
      getRateLimitKey("admin-upload", request),
      DEFAULT_UPLOAD_RATE_LIMIT.maxRequests,
      DEFAULT_UPLOAD_RATE_LIMIT.windowMs,
    );
    if (!limited.allowed) throw new Error("Upload rate limit exceeded");

    const body = (await request.json()) as Record<string, unknown> & { files?: unknown };
    const fileDescriptors: FileDescriptor[] = Array.isArray(body.files) ? (body.files as FileDescriptor[]) : [];
    if (!fileDescriptors.length) throw new Error("Select at least one file to upload.");

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key !== "files" && (typeof value === "string" || typeof value === "number")) {
        configFormData.append(key, String(value));
      }
    }
    parseUploadConfig(configFormData);

    const batchName = (
      String(body.batchName ?? "") || "Content Upload " + new Date().toISOString().slice(0, 10)
    ).trim();
    const batchId = createId("batch");
    const batchSlug = slugify(batchName);
    const contentDestination = String(body.contentDestination ?? "").trim() || "uploads";

    const uploads = await Promise.all(
      fileDescriptors.map(async (file) => {
        const uploadId = createId("upload");
        const safeName = assertValidUploadName(file.name);
        const storagePath = "uploads/" + contentDestination + "/" + batchId + "/" + uploadId + "-" + safeName;
        let signedUrl: string | null = null;
        try {
          signedUrl = await createAdminSignedUploadUrl(storagePath);
        } catch (error) {
          console.warn(`[presign] signed upload unavailable for ${storagePath}; legacy fallback enabled`, error);
        }
        return { uploadId, storagePath, safeName, signedUrl, directUpload: null };
      }),
    );

    return Response.json(
      { success: true, batchId, batchSlug, uploads },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch (error) {
    const err = error as Error;
    const body: Record<string, unknown> = {
      success: false,
      error: err.message ?? "Presign failed.",
      reason: err.name ?? "UnknownError",
      status: 400,
    };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
