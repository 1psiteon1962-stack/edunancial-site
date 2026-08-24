import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";

function validateEditRecipe(value: unknown) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const trimStart = input.trimStart === undefined ? 0 : Number(input.trimStart);
  const trimEnd = input.trimEnd === undefined ? null : Number(input.trimEnd);
  if (!Number.isFinite(trimStart) || trimStart < 0) throw new Error("trimStart must be a non-negative number.");
  if (trimEnd !== null && (!Number.isFinite(trimEnd) || trimEnd <= trimStart)) throw new Error("trimEnd must be greater than trimStart.");
  return { trimStart, trimEnd, musicStoragePath: null };
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as { projectId?: unknown; editRecipe?: unknown };
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(projectId)) throw new Error("A valid projectId is required.");
    const editRecipe = validateEditRecipe(body.editRecipe);
    const supabase = getSupabaseAdminClient();
    const { data: source, error: sourceError } = await supabase.from("video_assets").select("id").eq("project_id", projectId).eq("asset_type", "RAW_VIDEO").single();
    if (sourceError || !source) throw new Error("Raw video asset not found.");
    const { data: job, error: jobError } = await supabase.from("video_jobs").upsert({ project_id: projectId, source_asset_id: source.id, stage: "RENDER_MASTER", status: "queued", edit_recipe: editRecipe, last_error: null, completed_at: null }, { onConflict: "project_id,stage" }).select("id,status").single();
    if (jobError || !job) throw new Error(jobError?.message ?? "Could not queue video job.");
    await supabase.from("video_projects").update({ status: "uploaded", edit_recipe: editRecipe, updated_at: new Date().toISOString() }).eq("id", projectId);
    const baseUrl = process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "");
    if (!baseUrl) throw new Error("WORKER_BASE_URL is not configured.");
    const path = `/internal/jobs/${job.id}/execute`;
    const payload = JSON.stringify({ jobId: job.id });
    const signed = signWorkerRequest("POST", path, payload);
    const workerResponse = await fetch(`${baseUrl}${path}`, { method: "POST", headers: { "content-type": "application/json", "x-edunancial-timestamp": signed.timestamp, "x-edunancial-request-id": signed.requestId, "x-edunancial-signature": signed.signature }, body: payload, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!workerResponse.ok) {
      const message = (await workerResponse.text()).slice(0, 500);
      await supabase.from("video_jobs").update({ status: "failed", last_error: `Worker rejected request (${workerResponse.status}): ${message}`, completed_at: new Date().toISOString() }).eq("id", job.id);
      throw new Error(`Worker rejected job with HTTP ${workerResponse.status}.`);
    }
    return Response.json({ success: true, projectId, jobId: job.id, status: "queued" }, { status: 202, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Could not trigger video worker." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
}
