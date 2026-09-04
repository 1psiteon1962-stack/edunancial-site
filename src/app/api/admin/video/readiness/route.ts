import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

type ReadinessCheck = { id: string; label: string; ok: boolean; detail: string; optional?: boolean };

function workerBaseUrl() {
  return process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "") ?? "";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const checks: ReadinessCheck[] = [];
  const supabase = getSupabaseAdminClient();

  const tableNames = ["video_projects", "video_assets", "video_jobs", "video_scenes", "video_audio_tracks"] as const;
  for (const table of tableNames) {
    const { error } = await supabase.from(table).select("id", { head: true, count: "exact" }).limit(1);
    checks.push({ id: `table:${table}`, label: `Database table: ${table}`, ok: !error, detail: error ? error.message : "Available" });
  }

  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  const bucketNames = new Set((buckets ?? []).map((bucket) => bucket.name));
  for (const bucket of ["raw-videos", "processed-videos"] as const) {
    const exists = !bucketError && bucketNames.has(bucket);
    checks.push({ id: `bucket:${bucket}`, label: `Private storage bucket: ${bucket}`, ok: exists, detail: bucketError ? bucketError.message : exists ? "Available" : "Missing" });
    if (exists) {
      const probePath = `.readiness/${crypto.randomUUID()}.probe`;
      const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(probePath);
      checks.push({ id: `bucket-write:${bucket}`, label: `Storage upload capability: ${bucket}`, ok: !error && Boolean(data?.signedUrl), detail: error ? error.message : data?.signedUrl ? "Signed upload available" : "Signed upload URL unavailable" });
    } else {
      checks.push({ id: `bucket-write:${bucket}`, label: `Storage upload capability: ${bucket}`, ok: false, detail: "Bucket unavailable" });
    }
  }

  const baseUrl = workerBaseUrl();
  const secret = process.env.WORKER_SHARED_SECRET?.trim() ?? "";
  checks.push({ id: "config:worker-url", label: "Worker URL", ok: Boolean(baseUrl) && (process.env.NODE_ENV !== "production" || /^https:\/\//iu.test(baseUrl)), detail: !baseUrl ? "WORKER_BASE_URL is not configured" : process.env.NODE_ENV === "production" && !/^https:\/\//iu.test(baseUrl) ? "Production worker URL must use HTTPS" : "Configured" });
  checks.push({ id: "config:worker-secret", label: "Worker shared secret", ok: secret.length >= 32, detail: secret.length >= 32 ? "Configured" : "WORKER_SHARED_SECRET must be at least 32 characters" });

  let signingOk = false;
  let signingDetail = "Worker shared secret is not usable";
  try {
    const path = "/internal/jobs/00000000-0000-4000-8000-000000000000/execute";
    const payload = JSON.stringify({ jobId: "00000000-0000-4000-8000-000000000000" });
    const signed = signWorkerRequest("POST", path, payload);
    signingOk = /^[a-f0-9]{64}$/u.test(signed.signature) && signed.requestId.length > 0 && signed.timestamp.length > 0;
    signingDetail = signingOk ? "Dispatch signing operational" : "Dispatch signature was malformed";
  } catch (error) {
    signingDetail = error instanceof Error ? error.message : "Dispatch signing failed";
  }
  checks.push({ id: "worker:dispatch-signing", label: "Worker dispatch signing", ok: signingOk, detail: signingDetail });

  const ttsKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const ttsModel = process.env.EDUNANCIAL_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
  checks.push({ id: "config:tts-provider", label: "Multilingual text-to-speech (optional)", ok: ttsKey.length > 0, optional: true, detail: ttsKey.length > 0 ? `Configured (${ttsModel})` : "Optional AI narration is unavailable; microphone narration and video rendering remain available" });

  let healthOk = false;
  let healthDetail = "Worker URL is not configured";
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/health`, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(5000) });
      const body = await response.json().catch(() => null) as { ok?: unknown; service?: unknown } | null;
      healthOk = response.ok && body?.ok === true;
      healthDetail = healthOk ? typeof body?.service === "string" ? `Healthy: ${body.service}` : "Healthy" : `Worker health check failed (HTTP ${response.status})`;
    } catch (error) {
      healthDetail = error instanceof Error ? error.message : "Worker health check failed";
    }
  }
  checks.push({ id: "worker:health", label: "Video worker health", ok: healthOk, detail: healthDetail });

  const ready = checks.filter((check) => !check.optional).every((check) => check.ok);
  return Response.json({ success: true, ready, checkedAt: new Date().toISOString(), checks }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
