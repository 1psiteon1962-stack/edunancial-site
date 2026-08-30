import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REQUIRED_VIDEO_BUCKETS = ["raw-videos", "processed-videos"] as const;

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    return Response.json({ success: false, error: `Could not inspect video storage: ${listError.message}` }, { status: 500 });
  }

  const existing = new Set((buckets ?? []).map((bucket) => bucket.name));
  const created: string[] = [];

  for (const bucket of REQUIRED_VIDEO_BUCKETS) {
    if (existing.has(bucket)) continue;
    const { error } = await supabase.storage.createBucket(bucket, { public: false });
    if (error) {
      return Response.json(
        { success: false, error: `Could not create private storage bucket ${bucket}: ${error.message}`, created },
        { status: 500 },
      );
    }
    created.push(bucket);
  }

  const { data: verifiedBuckets, error: verifyError } = await supabase.storage.listBuckets();
  if (verifyError) {
    return Response.json({ success: false, error: `Video storage repair ran, but verification failed: ${verifyError.message}`, created }, { status: 500 });
  }

  const verified = new Set((verifiedBuckets ?? []).map((bucket) => bucket.name));
  const missing = REQUIRED_VIDEO_BUCKETS.filter((bucket) => !verified.has(bucket));
  if (missing.length) {
    return Response.json({ success: false, error: `Required video storage is still missing: ${missing.join(", ")}`, created, missing }, { status: 500 });
  }

  return Response.json({
    success: true,
    created,
    message: created.length
      ? `Created private bucket${created.length === 1 ? "" : "s"}: ${created.join(", ")}`
      : "Required private video storage buckets already exist.",
  });
}
