import { NextResponse } from "next/server";
import { actorFromRequest, getCmsEngine } from "@/lib/cms/engine";

export const runtime = "nodejs";

const engine = getCmsEngine();

function handleAction(action: string, body: Record<string, unknown>, actor: { userId: string; role: string }) {
  const lessonId = String(body.lessonId || "");

  switch (action) {
    case "create":
      return engine.createLesson(body, actor);
    case "edit":
      return engine.editLesson(lessonId, (body.updates as Record<string, unknown>) || {}, actor);
    case "rollback":
      return engine.rollbackLesson(lessonId, Number(body.targetVersion), actor);
    case "approve":
      return engine.transitionStatus(lessonId, "approved", actor);
    case "archive":
      return engine.archiveLesson(lessonId, actor);
    case "restore":
      return engine.restoreLesson(lessonId, actor);
    case "assignReviewer":
      return engine.assignRole(lessonId, "reviewer", body.assignee, actor);
    case "assignTranslator":
      return engine.assignRole(lessonId, "translator", body.assignee, actor);
    case "lock":
      return engine.lockLesson(lessonId, actor);
    case "unlock":
      return engine.unlockLesson(lessonId, actor);
    case "publish":
      return engine.publishLesson(lessonId, actor);
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

export async function GET(request: Request) {
  try {
    const actor = actorFromRequest(request);
    const url = new URL(request.url);
    const lessonId = url.searchParams.get("lessonId");

    if (lessonId) {
      return NextResponse.json({ lesson: engine.getLesson(lessonId, actor) });
    }

    const query = {
      lessonId: url.searchParams.get("lessonId") || undefined,
      track: url.searchParams.get("track") || undefined,
      level: url.searchParams.get("level") || undefined,
      title: url.searchParams.get("title") || undefined,
      keyword: url.searchParams.get("keyword") || undefined,
      author: url.searchParams.get("author") || undefined,
      status: url.searchParams.get("status") || undefined,
      region: url.searchParams.get("region") || undefined,
      language: url.searchParams.get("language") || undefined,
      competency: url.searchParams.get("competency") || undefined,
      seoKeyword: url.searchParams.get("seoKeyword") || undefined,
      filter: url.searchParams.get("filter") || undefined,
    };

    const lessons = engine.listLessons(query, actor);
    return NextResponse.json({ lessons, dashboard: engine.getDashboard() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load content" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = actorFromRequest(request);
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");

    const result = handleAction(action, body, actor);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed CMS action" }, { status: 400 });
  }
}
