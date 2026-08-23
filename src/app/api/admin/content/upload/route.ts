import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatch } from "@/lib/admin-content/service";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

// Small curriculum ZIPs still require substantial server-side work after the
// request body arrives: extraction, validation/classification of every lesson,
// conflict inspection, storage/audit writes, and review-batch persistence.
// Match the direct-storage finalizer's execution allowance so a valid 50-lesson
// ZIP is not terminated simply because its compressed byte size is small.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    await recordUploadOperation({ phase: "LEGACY_UPLOAD", status: "STARTED" });
    const formData = await request.formData();
    const batch = await createUploadBatch(request, toActor(auth.session), formData);
    const batchId = typeof (batch as { id?: unknown }).id === "string" ? String((batch as { id: string }).id) : null;

    // Do not report success for an archive that produced no reviewable files.
    // Surface the server-side extraction/validation warning to the dashboard.
    if (batch.uploads.length === 0 || batch.files.length === 0) {
      const detail = batch.warnings.length
        ? batch.warnings.join(" | ")
        : "No reviewable files were produced from the uploaded object(s).";
      throw new Error(`Uploaded file could not be processed: ${detail}`);
    }

    await recordUploadOperation({ batchId, phase: "LEGACY_UPLOAD", status: "SUCCEEDED", metadata: { reviewableFiles: batch.files.length } });
    return Response.json(
      { success: true, batch },
      { status: 201, headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch (error) {
    const err = error as Error;
    try {
      await recordUploadOperation({ phase: "LEGACY_UPLOAD", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    } catch (auditError) {
      console.error("[legacy-upload] unable to persist failure audit", auditError);
    }
    const body: Record<string, unknown> = {
      success: false,
      error: err.message || "Upload failed.",
      reason: err.name || "UnknownError",
      status: 400,
    };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, {
      status: 400,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
}
