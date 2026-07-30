import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { actorFromAdminSession, getCmsEngine } from "@/lib/cms/engine";

export const runtime = "nodejs";

const engine = getCmsEngine();

export async function GET(request: Request) {
  try {
    const auth = await requireAdminApiSession(request);
    if (!auth.ok) return auth.response;
    const actor = actorFromAdminSession(auth.session);
    return NextResponse.json({ media: engine.getMedia(actor) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load media" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminApiSession(request, true);
    if (!auth.ok) return auth.response;
    const actor = actorFromAdminSession(auth.session);
    const body = await request.json();
    const media = engine.uploadMedia(body, actor);
    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to upload media" }, { status: 400 });
  }
}
