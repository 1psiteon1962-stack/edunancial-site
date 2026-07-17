import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getCourse, saveCourse } from "@/lib/admin-content/course-storage";
import type { AdminModule } from "@/lib/admin-content/types";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return Response.json({ error: "Title required" }, { status: 400 });
  }

  const now = nowIso();
  const moduleItem: AdminModule = {
    id: createId("mod"),
    courseId,
    title: body.title,
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: body.description || "",
    order: course.modules.length,
    lessons: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  course.modules.push(moduleItem);
  course.updatedAt = now;
  await saveCourse(course);

  return Response.json({ module: moduleItem }, { status: 201 });
}
