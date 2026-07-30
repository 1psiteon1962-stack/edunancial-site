import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { actorFromAdminSession, getCmsEngine } from "@/lib/cms/engine";

export const runtime = "nodejs";

const engine = getCmsEngine();

export async function GET(request: Request, context: { params: Promise<{ lessonId: string }> }) {
  try {
    const auth = await requireAdminApiSession(request);
    if (!auth.ok) return auth.response;
    const actor = actorFromAdminSession(auth.session);
    const { lessonId } = await context.params;
    const localization = engine.getLocalization(lessonId, actor);
    return NextResponse.json({ lessonId, localization });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load localization" }, { status: 400 });
  }
}
