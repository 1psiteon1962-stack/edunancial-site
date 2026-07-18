import { requireContentLoaderApiSession } from "@/lib/content-loader/auth";
import { type ContentLoaderMode } from "@/lib/content-loader/content";
import { publishContentLoaderUpdate, saveContentLoaderDraft } from "@/lib/content-loader/service";

type ContentLoaderRequestBody = {
  action?: "save-draft" | "publish";
  color?: "Red" | "White" | "Blue";
  level?: "1" | "2" | "3" | "4" | "5";
  language?: "English" | "Spanish" | "French" | "Portuguese" | "Arabic" | "Japanese" | "Korean" | "Chinese";
  category?: "Book" | "Course" | "Lesson" | "Article" | "FAQ" | "Video" | "Prompt" | "Other";
  destination?: string;
  content?: string;
  mode?: ContentLoaderMode;
  confirmReplace?: boolean;
};

function isValidMode(mode: string | undefined): mode is ContentLoaderMode {
  return mode === "append" || mode === "replace";
}

export async function POST(request: Request) {
  const auth = await requireContentLoaderApiSession(request, true);
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json().catch(() => null) as ContentLoaderRequestBody | null;
  if (!body || !body.action || !body.destination || typeof body.content !== "string" || !isValidMode(body.mode)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.color || !body.level || !body.language || !body.category) {
    return Response.json({ error: "Color, level, language, and content category are required." }, { status: 400 });
  }
  if (body.action === "publish" && body.mode === "replace" && !body.confirmReplace) {
    return Response.json({ error: "Replace mode requires confirmation." }, { status: 400 });
  }

  if (body.action === "save-draft") {
    const draft = await saveContentLoaderDraft({
      color: body.color,
      level: body.level,
      language: body.language,
      category: body.category,
      destination: body.destination,
      content: body.content,
    }, body.mode);
    return Response.json({ ok: true, draft });
  }

  try {
    const publish = await publishContentLoaderUpdate({
      color: body.color,
      level: body.level,
      language: body.language,
      category: body.category,
      destination: body.destination,
      content: body.content,
    }, body.mode, auth.session.email);

    return Response.json({
      ok: true,
      publish: {
        fileUpdated: publish.destination,
        commitSha: publish.commitSha,
        commitUrl: publish.commitUrl,
        netlifyDeploymentStarted: Boolean(publish.commitSha),
        netlifyDeploymentCompleted: null,
        websitePublished: null,
      },
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
