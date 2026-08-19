import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatch } from "@/lib/admin-content/service";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    await recordUploadOperation({ phase: "LEGACY_UPLOAD", status: "STARTED" });
    const formData = await request.formData();
    const batch = await createUploadBatch(request, toActor(auth.session), formData);
    const batchId = typeof (batch as { id?: unknown }).id === "string" ? String((batch as { id: string }).id) : null;
    await recordUploadOperation({ batchId, phase: "LEGACY_UPLOAD", status: "SUCCEEDED" });
    return Response.json({ success: true, batch }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ phase: "LEGACY_UPLOAD", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    const body: Record<string, unknown> = { success: false, error: err.message ?? "Upload failed.", reason: err.name ?? "UnknownError", status: 400 };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400 });
  }
}
