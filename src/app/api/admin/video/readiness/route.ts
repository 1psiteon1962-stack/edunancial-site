import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getNeonSql, readDatabaseUrl } from "@/lib/db/neon";
import { signWorkerRequest } from "@/lib/video-pipeline/hmac";
import { probeVideoStorageAccess } from "@/lib/video/storage-client";
import { readVideoStorageConfig } from "@/lib/video/storage";

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

  const databaseUrl = readDatabaseUrl();
  checks.push({
    id: "config:video-database",
    label: "Video metadata database",
    ok: Boolean(databaseUrl),
    detail: databaseUrl ? "Neon/Postgres configured" : "DATABASE_URL or NETLIFY_DATABASE_URL is not configured",
  });

  if (databaseUrl) {
    try {
      const sql = getNeonSql();
      if (!sql) throw new Error("Video database client could not be initialized.");
      const rows = await sql`
        select
          to_regclass('public.video_r2_projects')::text as projects,
          to_regclass('public.video_r2_assets')::text as assets,
          to_regclass('public.video_r2_scenes')::text as scenes,
          to_regclass('public.video_r2_audio_tracks')::text as audio_tracks,
          to_regclass('public.video_r2_jobs')::text as jobs
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      for (const [key, label] of [
        ["projects", "video_r2_projects"],
        ["assets", "video_r2_assets"],
        ["scenes", "video_r2_scenes"],
        ["audio_tracks", "video_r2_audio_tracks"],
        ["jobs", "video_r2_jobs"],
      ] as const) {
        const ok = Boolean(row?.[key]);
        checks.push({
          id: `table:${label}`,
          label: `Neon table: ${label}`,
          ok,
          detail: ok ? "Available" : "Missing; apply the Video R2 Neon migration",
        });
      }
    } catch (error) {
      checks.push({
        id: "database:video-r2",
        label: "Video R2 database connectivity",
        ok: false,
        detail: error instanceof Error ? error.message : "Video R2 database check failed",
      });
    }
  }

  const storageConfig = readVideoStorageConfig();
  checks.push({
    id: "config:video-storage",
    label: "Video object storage",
    ok: Boolean(storageConfig),
    detail: storageConfig ? `Configured bucket: ${storageConfig.bucket}` : "VIDEO_R2_* storage configuration is incomplete",
  });
  if (storageConfig) {
    try {
      const probe = await probeVideoStorageAccess(undefined, storageConfig);
      checks.push({ id: "storage:access", label: "Video object storage access", ok: probe.accessible, detail: `Accessible: ${probe.bucket}` });
    } catch (error) {
      checks.push({
        id: "storage:access",
        label: "Video object storage access",
        ok: false,
        detail: error instanceof Error ? error.message : "Video object storage access check failed",
      });
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
  return Response.json({ success: true, ready, architecture: "neon+r2+railway", checkedAt: new Date().toISOString(), checks }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
