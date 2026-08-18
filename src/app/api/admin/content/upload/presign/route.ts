/**
 * POST /api/admin/content/upload/presign
 *
 * Phase 1 of the two-phase upload flow. Production uploads are required to use
 * a server-generated Supabase signed URL. This avoids Netlify request-body
 * limits and avoids anonymous storage writes, which are intentionally denied by
 * RLS.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_UPLOAD_RATE_LIMIT } from "@/lib/admin-content/config";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import { assertValidUploadName } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { prepareAdminUploadStorageRuntime } from "@/lib/admin-content/storage/runtime";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { createId, slugify } from "@/lib/admin-content/utils";

type FileDescriptor = { name: string; size: number; type: string };

export const maxDuration = 26;

function isMissingBucketResponse(status: number, bodyText: string) {
  if (status === 404) return true;
  try {
    const body = JSON.parse(bodyText) as { statusCode?: string | number; error?: string; message?: string };
    return (
      String(body.statusCode ?? "") === "404" ||
      body.error === "Bucket not found" ||
      (body.message ?? "").toLowerCase().includes("bucket not found")
    );
  } catch {
    return false;
  }
}

async function assertProductionStorageReady() {
  const runtime = prepareAdminUploadStorageRuntime();
  if (process.env.NODE_ENV !== "production") return runtime;

  const supabaseUrl = runtime.supabaseUrl;
  const checkKey = runtime.serviceRoleKey;
  const bucket = runtime.bucket;
  if (!supabaseUrl || !checkKey || !bucket) {
    throw new Error("Admin upload storage health check failed: production Supabase storage is incomplete.");
  }

  // The production connectivity check is unconditional once supabaseUrl,
  // checkKey, and bucket are available. Keeping this explicit prevents a
  // regression to the former anon/service-role split behavior.
  if (supabaseUrl && checkKey && bucket) {
    const response = await fetch(
      `${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + checkKey,
          apikey: checkKey,
        },
        cache: "no-store",
      },
    ).catch(() => null);

    if (!response) {
      throw new Error(
        "Admin upload storage health check failed: Supabase Storage is unreachable. " +
          "No file was uploaded; verify the Supabase project URL and project availability.",
      );
    }

    // content-type text/html means the configured URL is returning an app or
    // proxy page rather than the Supabase Storage API.
    const contentType = response.headers.get("content-type") ?? "";
    const bodyText = await response.text();
    if (contentType.toLowerCase().includes("text/html")) {
      throw new Error(
        "Admin upload storage health check failed: NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured or points to the wrong host/Netlify site URL; " +
          "the bucket endpoint returned text/html instead of the Supabase Storage API. No file was uploaded.",
      );
    }

    if (response.ok) return runtime;

    if (!isMissingBucketResponse(response.status, bodyText)) {
      throw new Error(
        `Admin upload storage health check failed (HTTP ${response.status}). ` +
          "No file was uploaded; verify SUPABASE_SERVICE_ROLE_KEY and Supabase Storage availability.",
      );
    }

    const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + checkKey,
        apikey: checkKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: bucket, name: bucket, public: false }),
      cache: "no-store",
    });

    if (!createResponse.ok) {
      const createBody = await createResponse.text();
      const duplicate = /already exists|duplicate/i.test(createBody);
      if (!duplicate) {
        throw new Error(
          `Admin upload storage bucket setup failed (HTTP ${createResponse.status}). ` +
            "No file was uploaded; verify the production service-role credential.",
        );
      }
    }

    const verify = await fetch(
      `${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + checkKey,
          apikey: checkKey,
        },
        cache: "no-store",
      },
    );
    if (!verify.ok) {
      throw new Error(
        "Admin upload storage bucket could not be verified after setup. No file was uploaded.",
      );
    }
  }

  return runtime;
}

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

    await assertProductionStorageReady();
    const storage = getAdminContentStorage();

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
        const signedUrl = await storage.getSignedUploadUrl(storagePath);

        if (process.env.NODE_ENV === "production" && !signedUrl) {
          throw new Error(
            "Admin upload storage is configured but could not issue a signed upload URL. " +
              "No file was uploaded; verify SUPABASE_SERVICE_ROLE_KEY and retry.",
          );
        }

        return {
          uploadId,
          storagePath,
          safeName,
          signedUrl: signedUrl ?? null,
          directUpload: null,
        };
      }),
    );

    return Response.json({ success: true, batchId, batchSlug, uploads });
  } catch (error) {
    const err = error as Error;
    const body: Record<string, unknown> = {
      success: false,
      error: err.message ?? "Upload preparation failed.",
      reason: err.name ?? "UnknownError",
      status: 400,
    };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400 });
  }
}
