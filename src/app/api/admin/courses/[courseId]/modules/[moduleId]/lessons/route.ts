import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getCourse, saveCourse } from "@/lib/admin-content/course-storage";
import type { AdminLesson } from "@/lib/admin-content/types";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const moduleItem = course.modules.find((moduleRecord) => moduleRecord.id === moduleId);
  if (!moduleItem) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return Response.json({ error: "Title required" }, { status: 400 });
  }

  const now = nowIso();
  const lesson: AdminLesson = {
    id: createId("lesson"),
    moduleId,
    courseId,
    title: body.title,
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: body.description || "",
    duration: body.duration || "",
    order: moduleItem.lessons.length,
    blocks: body.blocks || [],
    aiCoachPrompt: body.aiCoachPrompt || "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  moduleItem.lessons.push(lesson);
  course.updatedAt = now;
  await saveCourse(course);

  return Response.json({ lesson }, { status: 201 });
}
