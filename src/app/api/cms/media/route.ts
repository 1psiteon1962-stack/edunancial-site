import { NextResponse } from "next/server";
import { actorFromRequest, getCmsEngine } from "@/lib/cms/engine";

export const runtime = "nodejs";

const engine = getCmsEngine();

export async function GET(request: Request) {
  try {
    const actor = actorFromRequest(request);
    return NextResponse.json({ media: engine.getMedia(actor) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load media" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = actorFromRequest(request);
    const body = await request.json();
    const media = engine.uploadMedia(body, actor);
    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to upload media" }, { status: 400 });
  }
}
