import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { createRawVideoUploadUrl } from "@/lib/video/jobs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json() as { path?: string };
    if (!body.path) return NextResponse.json({ error: "path is required" }, { status: 400 });
    return NextResponse.json(await createRawVideoUploadUrl(body.path));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload initialization failed" }, { status: 400 });
  }
}
