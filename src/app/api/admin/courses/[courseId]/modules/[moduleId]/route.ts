import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getCourse, saveCourse } from "@/lib/admin-content/course-storage";

function nowIso() {
  return new Date().toISOString();
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const idx = course.modules.findIndex((moduleItem) => moduleItem.id === moduleId);
  if (idx < 0) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const now = nowIso();
  course.modules[idx] = {
    ...course.modules[idx],
    ...body,
    id: moduleId,
    courseId,
    updatedAt: now,
  };
  course.updatedAt = now;
  await saveCourse(course);

  return Response.json({ module: course.modules[idx] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  course.modules = course.modules.filter((moduleItem) => moduleItem.id !== moduleId);
  course.updatedAt = nowIso();
  await saveCourse(course);

  return Response.json({ ok: true });
}
