import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatchFromStoredFiles, type StoredUploadEntry } from "@/lib/admin-content/service";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";
import { recordUploadOperation } from "@/lib/admin-content/upload-operations";

export const maxDuration = 26;

type FinalizeBody = { batchId: string; batchName?: string; source?: string; notes?: string; uploads: StoredUploadEntry[]; [key: string]: unknown };

export async function POST(request: NextRequest) {
  let batchId: string | null = null;
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const body = (await request.json()) as FinalizeBody;
    batchId = body.batchId;
    const { uploads } = body;
    if (!batchId) throw new Error("batchId is required.");
    if (!Array.isArray(uploads) || !uploads.length) throw new Error("No uploaded files provided.");

    await recordUploadOperation({ batchId, phase: "FINALIZE", status: "STARTED", metadata: { fileCount: uploads.length } });

    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key !== "batchId" && key !== "batchName" && key !== "source" && key !== "notes" && key !== "uploads" && (typeof value === "string" || typeof value === "number")) configFormData.append(key, String(value));
    }
    const uploadConfig = parseUploadConfig(configFormData);
    const batch = await createUploadBatchFromStoredFiles(request, toActor(auth.session), { batchId, batchName: String(body.batchName ?? ""), source: String(body.source ?? ""), notes: String(body.notes ?? ""), uploadConfig, uploads });

    await recordUploadOperation({ batchId, phase: "FINALIZE", status: "SUCCEEDED", metadata: { fileCount: uploads.length } });
    return Response.json({ success: true, batch }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    await recordUploadOperation({ batchId, phase: "FINALIZE", status: "FAILED", errorCode: err.name, errorMessage: err.message });
    const body: Record<string, unknown> = { success: false, error: err.message ?? "Finalize failed.", reason: err.name ?? "UnknownError", status: 400 };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return Response.json(body, { status: 400 });
  }
}
