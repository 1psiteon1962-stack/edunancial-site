import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  deleteCourse,
  getCourse,
  saveCourse,
} from "@/lib/admin-content/course-storage";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ course });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const now = nowIso();
  const updated = { ...course, ...body, id: course.id, updatedAt: now };

  if (body.status === "published" && course.status !== "published") {
    updated.publishedAt = now;
  }
  if (body.status === "archived" && course.status !== "archived") {
    updated.archivedAt = now;
  }

  await saveCourse(updated);
  return Response.json({ course: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });

  if (course.status === "published") {
    return Response.json(
      { error: "Cannot delete a published course. Archive it first." },
      { status: 400 },
    );
  }

  await deleteCourse(courseId);
  return Response.json({ ok: true });
}
