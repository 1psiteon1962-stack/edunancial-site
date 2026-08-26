import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

type ReadinessCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

function workerBaseUrl() {
  return process.env.WORKER_BASE_URL?.trim().replace(/\/+$/u, "") ?? "";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const checks: ReadinessCheck[] = [];
  const supabase = getSupabaseAdminClient();

  const tableNames = ["video_projects", "video_assets", "video_jobs", "video_scenes"] as const;
  for (const table of tableNames) {
    const { error } = await supabase.from(table).select("id", { head: true, count: "exact" }).limit(1);
    checks.push({
      id: `table:${table}`,
      label: `Database table: ${table}`,
      ok: !error,
      detail: error ? error.message : "Available",
    });
  }

  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  const bucketNames = new Set((buckets ?? []).map((bucket) => bucket.name));
  for (const bucket of ["raw-videos", "processed-videos"] as const) {
    const exists = !bucketError && bucketNames.has(bucket);
    checks.push({
      id: `bucket:${bucket}`,
      label: `Private storage bucket: ${bucket}`,
      ok: exists,
      detail: bucketError ? bucketError.message : exists ? "Available" : "Missing",
    });
  }

  const baseUrl = workerBaseUrl();
  const secret = process.env.WORKER_SHARED_SECRET?.trim() ?? "";
  checks.push({
    id: "config:worker-url",
    label: "Worker URL",
    ok: Boolean(baseUrl) && (process.env.NODE_ENV !== "production" || /^https:\/\//iu.test(baseUrl)),
    detail: !baseUrl
      ? "WORKER_BASE_URL is not configured"
      : process.env.NODE_ENV === "production" && !/^https:\/\//iu.test(baseUrl)
        ? "Production worker URL must use HTTPS"
        : "Configured",
  });
  checks.push({
    id: "config:worker-secret",
    label: "Worker shared secret",
    ok: secret.length >= 32,
    detail: secret.length >= 32 ? "Configured" : "WORKER_SHARED_SECRET must be at least 32 characters",
  });

  let healthOk = false;
  let healthDetail = "Worker URL is not configured";
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const body = await response.json().catch(() => null) as { ok?: unknown; service?: unknown } | null;
      healthOk = response.ok && body?.ok === true;
      healthDetail = healthOk
        ? typeof body?.service === "string" ? `Healthy: ${body.service}` : "Healthy"
        : `Worker health check failed (HTTP ${response.status})`;
    } catch (error) {
      healthDetail = error instanceof Error ? error.message : "Worker health check failed";
    }
  }
  checks.push({
    id: "worker:health",
    label: "Video worker health",
    ok: healthOk,
    detail: healthDetail,
  });

  const ready = checks.every((check) => check.ok);
  return Response.json(
    {
      success: true,
      ready,
      checkedAt: new Date().toISOString(),
      checks,
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
