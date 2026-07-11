import { NextResponse } from "next/server";
import { actorFromRequest, getCmsEngine } from "@/lib/cms/engine";

export const runtime = "nodejs";

const engine = getCmsEngine();

export async function GET(request: Request, context: { params: Promise<{ lessonId: string }> }) {
  try {
    const actor = actorFromRequest(request);
    const { lessonId } = await context.params;
    const versions = engine.getVersionHistory(lessonId, actor);
    return NextResponse.json({ lessonId, versions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load version history" }, { status: 400 });
  }
}
