import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { probeVideoStorageAccess } from "@/lib/video/storage-client";
import { readVideoStorageConfig } from "@/lib/video/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const config = readVideoStorageConfig();
  if (!config) {
    return Response.json(
      {
        success: false,
        error: "Video object storage is not configured. Set VIDEO_R2_ENDPOINT, VIDEO_R2_BUCKET, VIDEO_R2_ACCESS_KEY_ID, and VIDEO_R2_SECRET_ACCESS_KEY.",
        created: [],
      },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const probe = await probeVideoStorageAccess(undefined, config);
    return Response.json({
      success: true,
      created: [],
      bucket: probe.bucket,
      architecture: "object-storage",
      message: "Configured Video R2 object storage is accessible. No storage repair is required.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? `Video object storage is configured but inaccessible: ${error.message}` : "Video object storage is configured but inaccessible.",
        created: [],
        bucket: config.bucket,
      },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
