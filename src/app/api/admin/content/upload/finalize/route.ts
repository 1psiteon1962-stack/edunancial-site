/**
 * POST /api/admin/content/upload/finalize
 *
 * Phase 3 of the two-phase upload flow that bypasses Netlify's 6 MB
 * serverless-function request-body limit.
 *
 * Called after the browser has uploaded every file directly to Supabase
 * Storage (phase 2).  Reads each file from storage, validates it, extracts ZIP
 * contents, classifies extracted files, persists the review batch, and returns
 * it so the client can redirect to the batch review page.
 *
 * The request body carries only lightweight metadata — no file bytes — so it
 * comfortably fits within Netlify's function payload limits.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession, toActor } from "@/lib/admin-content/auth";
import { createUploadBatchFromStoredFiles, type StoredUploadEntry } from "@/lib/admin-content/service";
import { parseUploadConfig } from "@/lib/admin-content/upload-intake";

// Netlify synchronous functions allow up to 26 s; use the maximum so that
// ZIP extraction and content classification have enough time to complete.
export const maxDuration = 26;

type FinalizeBody = {
  batchId: string;
  batchName?: string;
  source?: string;
  notes?: string;
  uploads: StoredUploadEntry[];
  // Upload-config fields forwarded from the presign request body.
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as FinalizeBody;

    const { batchId, uploads } = body;
    if (!batchId) throw new Error("batchId is required.");
    if (!Array.isArray(uploads) || !uploads.length) throw new Error("No uploaded files provided.");

    // Parse upload config from the forwarded scalar fields.
    const configFormData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (
        key !== "batchId" &&
        key !== "batchName" &&
        key !== "source" &&
        key !== "notes" &&
        key !== "uploads" &&
        (typeof value === "string" || typeof value === "number")
      ) {
        configFormData.append(key, String(value));
      }
    }
    const uploadConfig = parseUploadConfig(configFormData);

    const batch = await createUploadBatchFromStoredFiles(request, toActor(auth.session), {
      batchId,
      batchName: String(body.batchName ?? ""),
      source: String(body.source ?? ""),
      notes: String(body.notes ?? ""),
      uploadConfig,
      uploads,
    });

    return Response.json({ batch }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
