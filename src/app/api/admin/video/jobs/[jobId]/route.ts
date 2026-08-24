import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  const { jobId } = await context.params;
  if (!/^[0-9a-f-]{36}$/iu.test(jobId)) return Response.json({ success: false, error: "Invalid job id." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("video_jobs")
    .select("id,project_id,status,attempt_count,last_error,started_at,completed_at,output_asset_id,updated_at")
    .eq("id", jobId)
    .single();

  if (error || !data) {
    return Response.json({ success: false, error: "Video job not found." }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  }

  let outputUrl: string | null = null;
  if (data.status === "succeeded" && data.output_asset_id) {
    const { data: asset } = await supabase
      .from("video_assets")
      .select("storage_bucket,storage_path")
      .eq("id", data.output_asset_id)
      .single();
    if (asset?.storage_bucket && asset?.storage_path) {
      const { data: signed } = await supabase.storage.from(asset.storage_bucket).createSignedUrl(asset.storage_path, 3600);
      outputUrl = signed?.signedUrl ?? null;
    }
  }

  // Keep the full job object while also returning the fields consumed by the
  // existing Video Studio polling client at the top level.
  return Response.json(
    {
      success: true,
      job: data,
      status: data.status,
      lastError: data.last_error,
      outputAssetId: data.output_asset_id,
      outputUrl,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
