import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listCourses, saveCourse } from "@/lib/admin-content/course-storage";
import type { AdminCourse } from "@/lib/admin-content/types";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const courses = await listCourses();
  return Response.json({ courses });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const now = nowIso();
  const course: AdminCourse = {
    id: createId("course"),
    title: body.title,
    slug:
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    subtitle: body.subtitle || "",
    description: body.description || "",
    status: "draft",
    path: body.path || "white",
    language: body.language || "en",
    region: body.region || null,
    country: body.country || null,
    difficulty: body.difficulty || "beginner",
    duration: body.duration || "",
    membershipTier: body.membershipTier || "free",
    instructorName: body.instructorName || "",
    instructorBio: body.instructorBio || "",
    thumbnailUrl: null,
    tags: body.tags || [],
    categories: body.categories || [],
    prerequisites: body.prerequisites || [],
    learningObjectives: body.learningObjectives || [],
    modules: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      keywords: [],
      canonicalUrl: "",
    },
    relatedCourseIds: [],
    relatedMarketplaceIds: [],
    publishedAt: null,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
    createdBy: auth.session.email,
  };

  await saveCourse(course);
  return Response.json({ course }, { status: 201 });
}
