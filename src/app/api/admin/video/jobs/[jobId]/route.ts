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

  if (error || !data) return Response.json({ success: false, error: "Video job not found." }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
  return Response.json({ success: true, job: data }, { headers: { "Cache-Control": "private, no-store" } });
}
