import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";

function lessonFilePath(id: string): string | null {
  const match = id.match(/^([A-Z]+)-L(\d+)-(\d{3})$/);
  if (!match) return null;
  const [, track, level] = match;
  return join(process.cwd(), `content/curriculum/${track}/L${level}/${id}.md`);
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: { lessonId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lessonId } = body;
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  const filePath = lessonFilePath(lessonId);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid lesson ID format" }, { status: 400 });
  }

  try {
    await unlink(filePath);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return NextResponse.json({ error: "Lesson file not found" }, { status: 404 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true, message: `Lesson ${lessonId} deleted.` });
}
