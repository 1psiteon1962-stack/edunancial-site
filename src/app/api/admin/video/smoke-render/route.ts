import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";

export const runtime = "nodejs";
export const maxDuration = 30;

const SMOKE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

function workerBaseUrl() {
  const value = process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "") ?? "";
  if (!value) throw new Error("WORKER_BASE_URL is not configured.");
  if (process.env.NODE_ENV === "production" && !/^https:\/\//iu.test(value)) {
    throw new Error("WORKER_BASE_URL must use HTTPS in production.");
  }
  return value;
}

async function generateNarration(locale: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const model = process.env.EDUNANCIAL_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      voice: "coral",
      input: "Edunancial video pipeline production test. Multilingual narration and vertical rendering are operational.",
      response_format: "mp3",
      instructions: `Speak clearly and naturally in ${locale}. Do not translate the supplied script.`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`TTS smoke test failed (${response.status}): ${detail.slice(0, 300) || "no response body"}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(request: NextRequest) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdminClient();
  const baseUrl = workerBaseUrl();
  const locale = "en-US";
  let projectId: string | null = null;
  let jobId: string | null = null;

  try {
    const narration = await generateNarration(locale);
    const { data: project, error: projectError } = await supabase.from("video_projects").insert({ title: `Production smoke render ${new Date().toISOString()}`, created_by: auth.session.email, status: "draft" }).select("id").single();
    if (projectError || !project) throw new Error(projectError?.message ?? "Could not create smoke-test project.");
    projectId = project.id;

    const imagePath = `projects/${project.id}/raw/${crypto.randomUUID()}-smoke.png`;
    const narrationPath = `projects/${project.id}/raw/${crypto.randomUUID()}-smoke-narration.mp3`;
    const { error: imageUploadError } = await supabase.storage.from("raw-videos").upload(imagePath, SMOKE_PNG, { contentType: "image/png", upsert: false });
    if (imageUploadError) throw imageUploadError;
    const { error: narrationUploadError } = await supabase.storage.from("raw-videos").upload(narrationPath, narration, { contentType: "audio/mpeg", upsert: false });
    if (narrationUploadError) throw narrationUploadError;

    const { data: imageAsset, error: imageAssetError } = await supabase.from("video_assets").insert({ project_id: project.id, asset_type: "RAW_IMAGE", storage_bucket: "raw-videos", storage_path: imagePath, original_filename: "smoke.png", mime_type: "image/png", byte_size: SMOKE_PNG.length }).select("id").single();
    if (imageAssetError || !imageAsset) throw new Error(imageAssetError?.message ?? "Could not register smoke image.");
    const { data: narrationAsset, error: narrationAssetError } = await supabase.from("video_assets").insert({ project_id: project.id, asset_type: "RAW_AUDIO", storage_bucket: "raw-videos", storage_path: narrationPath, original_filename: "smoke-narration.mp3", mime_type: "audio/mpeg", byte_size: narration.length }).select("id").single();
    if (narrationAssetError || !narrationAsset) throw new Error(narrationAssetError?.message ?? "Could not register smoke narration.");

    const { error: sceneError } = await supabase.from("video_scenes").insert({ project_id: project.id, asset_id: imageAsset.id, scene_order: 0, duration_seconds: 8, overlay_text: "EDUNANCIAL\nPRODUCTION VIDEO TEST", fit_mode: "cover", transition_type: "cut", transition_seconds: 0.35 });
    if (sceneError) throw sceneError;
    const { error: audioError } = await supabase.from("video_audio_tracks").insert({ project_id: project.id, asset_id: narrationAsset.id, track_type: "ORIGINAL_NARRATION", locale, transcript: "Edunancial video pipeline production test. Multilingual narration and vertical rendering are operational.", volume: 1, muted: false });
    if (audioError) throw audioError;

    const editRecipe = { trimStart: 0, trimEnd: null, durationSeconds: 8, musicStoragePath: null };
    const { data: job, error: jobError } = await supabase.from("video_jobs").insert({ project_id: project.id, source_asset_id: imageAsset.id, stage: "RENDER_MASTER", status: "queued", edit_recipe: editRecipe, last_error: null }).select("id").single();
    if (jobError || !job) throw new Error(jobError?.message ?? "Could not create smoke render job.");
    jobId = job.id;
    await supabase.from("video_projects").update({ status: "uploaded", edit_recipe: editRecipe, updated_at: new Date().toISOString() }).eq("id", project.id);

    const path = `/internal/jobs/${job.id}/execute`;
    const payload = JSON.stringify({ jobId: job.id });
    const signed = signWorkerRequest("POST", path, payload);
    const workerResponse = await fetch(`${baseUrl}${path}`, { method: "POST", headers: { "content-type": "application/json", "x-edunancial-timestamp": signed.timestamp, "x-edunancial-request-id": signed.requestId, "x-edunancial-signature": signed.signature }, body: payload, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!workerResponse.ok) {
      const detail = (await workerResponse.text()).slice(0, 500);
      throw new Error(`Worker rejected smoke render (${workerResponse.status}): ${detail || "no response body"}`);
    }

    return Response.json({ success: true, projectId: project.id, jobId: job.id, status: "queued", statusUrl: `/api/admin/video/jobs/${job.id}`, expectedOutput: { width: 1080, height: 1920, container: "mp4", narration: locale } }, { status: 202, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Production smoke render failed.";
    if (jobId) await supabase.from("video_jobs").update({ status: "failed", last_error: `Smoke render dispatch failed: ${message}`.slice(0, 4000), completed_at: new Date().toISOString() }).eq("id", jobId);
    if (projectId) await supabase.from("video_projects").update({ status: "failed", updated_at: new Date().toISOString() }).eq("id", projectId);
    return Response.json({ success: false, error: message, projectId, jobId }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}
