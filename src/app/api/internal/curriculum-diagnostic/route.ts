import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { diagnosticResolveLesson } from "@/lib/curriculum/authoritative-published";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const trackCode = url.searchParams.get("trackCode");
  const level = Number(url.searchParams.get("level"));
  const lessonId = url.searchParams.get("lessonId") ?? undefined;

  if (!trackCode || !level) {
    return Response.json({ error: "trackCode and level required" }, { status: 400 });
  }

  const result = await diagnosticResolveLesson({ trackCode, level, lessonId });
  return Response.json(result);
}
