import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getVideoR2Asset, getVideoR2Job } from "@/lib/video/repository";
import { openVideoObject } from "@/lib/video/storage-client";

export const runtime = "nodejs";

function safeDownloadName(jobId: string) {
  return `edunancial-video-${jobId}.mp4`;
}

export async function GET(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const { jobId } = await context.params;
  if (!/^[0-9a-f-]{36}$/iu.test(jobId)) {
    return Response.json({ success: false, error: "Invalid job id." }, { status: 400 });
  }

  const job = await getVideoR2Job(jobId, auth.session.email) as Record<string, unknown> | null;
  if (!job) {
    return Response.json({ success: false, error: "Video job not found." }, { status: 404 });
  }
  if (String(job.status) !== "succeeded" || typeof job.output_asset_id !== "string") {
    return Response.json({ success: false, error: "Video output is not ready." }, { status: 409 });
  }

  const asset = await getVideoR2Asset(job.output_asset_id, auth.session.email) as Record<string, unknown> | null;
  if (!asset?.storage_key) {
    return Response.json({ success: false, error: "Completed video asset not found." }, { status: 404 });
  }
  if (String(asset.mime_type || "") !== "video/mp4") {
    return Response.json({ success: false, error: "Completed asset is not an MP4." }, { status: 409 });
  }

  const object = await openVideoObject(String(asset.storage_key));
  const headers = new Headers({
    "Content-Type": "video/mp4",
    "Content-Disposition": `attachment; filename="${safeDownloadName(jobId)}"`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (object.contentLength !== undefined) headers.set("Content-Length", String(object.contentLength));

  return new Response(object.stream, { status: 200, headers });
}
