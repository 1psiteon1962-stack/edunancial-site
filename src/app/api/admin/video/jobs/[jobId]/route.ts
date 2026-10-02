import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getVideoR2Asset, getVideoR2Job } from "@/lib/video/repository";
import { presignVideoDownload } from "@/lib/video/storage-client";

export async function GET(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const { jobId } = await context.params;
  if (!/^[0-9a-f-]{36}$/iu.test(jobId)) {
    return Response.json({ success: false, error: "Invalid job id." }, { status: 400 });
  }

  const job = await getVideoR2Job(jobId, auth.session.email) as Record<string, unknown> | null;
  if (!job) {
    return Response.json(
      { success: false, error: "Video job not found." },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  let outputUrl: string | null = null;
  const outputAssetId = typeof job.output_asset_id === "string" ? job.output_asset_id : null;
  if (String(job.status) === "succeeded" && outputAssetId) {
    const asset = await getVideoR2Asset(outputAssetId, auth.session.email) as Record<string, unknown> | null;
    if (asset?.storage_key) outputUrl = await presignVideoDownload(String(asset.storage_key), 900);
  }

  return Response.json(
    {
      success: true,
      job,
      status: String(job.status),
      lastError: typeof job.last_error === "string" ? job.last_error : null,
      outputAssetId,
      outputUrl,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
