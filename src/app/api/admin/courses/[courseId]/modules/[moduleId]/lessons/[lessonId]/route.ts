import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getCourse, saveCourse } from "@/lib/admin-content/course-storage";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> },
) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId, lessonId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const moduleItem = course.modules.find((moduleRecord) => moduleRecord.id === moduleId);
  const lesson = moduleItem?.lessons.find((lessonRecord) => lessonRecord.id === lessonId);
  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  return Response.json({ lesson });
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId, lessonId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const modIdx = course.modules.findIndex((moduleRecord) => moduleRecord.id === moduleId);
  if (modIdx < 0) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  const lessonIdx = course.modules[modIdx].lessons.findIndex(
    (lessonRecord) => lessonRecord.id === lessonId,
  );
  if (lessonIdx < 0) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const now = nowIso();
  course.modules[modIdx].lessons[lessonIdx] = {
    ...course.modules[modIdx].lessons[lessonIdx],
    ...body,
    id: lessonId,
    moduleId,
    courseId,
    updatedAt: now,
  };
  course.updatedAt = now;
  await saveCourse(course);

  return Response.json({ lesson: course.modules[modIdx].lessons[lessonIdx] });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId, moduleId, lessonId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const modIdx = course.modules.findIndex((moduleRecord) => moduleRecord.id === moduleId);
  if (modIdx < 0) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  course.modules[modIdx].lessons = course.modules[modIdx].lessons.filter(
    (lessonRecord) => lessonRecord.id !== lessonId,
  );
  course.updatedAt = nowIso();
  await saveCourse(course);

  return Response.json({ ok: true });
}
