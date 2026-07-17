import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { saveCourse } from "@/lib/admin-content/course-storage";
import type { AdminCourse, AdminLesson, AdminModule } from "@/lib/admin-content/types";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateImportPayload(payload: unknown): string[] {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    errors.push("Payload must be a JSON object");
    return errors;
  }

  const record = payload as Record<string, unknown>;
  if (!record.title || typeof record.title !== "string") {
    errors.push("course.title is required");
  }
  if (!record.path || !["red", "white", "blue"].includes(String(record.path))) {
    errors.push("course.path must be 'red', 'white', or 'blue'");
  }
  if (!record.language) {
    errors.push("course.language is required");
  }
  if (record.modules && !Array.isArray(record.modules)) {
    errors.push("modules must be an array");
  }
  if (Array.isArray(record.modules)) {
    record.modules.forEach((moduleValue: unknown, index: number) => {
      if (!moduleValue || typeof moduleValue !== "object") {
        errors.push(`modules[${index}] must be an object`);
        return;
      }

      const moduleRecord = moduleValue as Record<string, unknown>;
      if (!moduleRecord.title) {
        errors.push(`modules[${index}].title is required`);
      }
      if (moduleRecord.lessons && !Array.isArray(moduleRecord.lessons)) {
        errors.push(`modules[${index}].lessons must be an array`);
      }
    });
  }

  return errors;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });

  const action = body.action ?? "preview";
  const payload = body.payload ?? body;

  const errors = validateImportPayload(payload);
  if (errors.length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const now = nowIso();
  const record = payload as Record<string, unknown>;
  const seoRecord =
    record.seo && typeof record.seo === "object"
      ? (record.seo as Record<string, unknown>)
      : undefined;

  const modules: AdminModule[] = (Array.isArray(record.modules) ? record.modules : []).map(
    (moduleValue: unknown, moduleIndex: number) => {
      const moduleRecord = moduleValue as Record<string, unknown>;
      const lessons: AdminLesson[] = (
        Array.isArray(moduleRecord.lessons) ? moduleRecord.lessons : []
      ).map((lessonValue: unknown, lessonIndex: number) => {
        const lessonRecord = lessonValue as Record<string, unknown>;
        const lessonTitle = String(lessonRecord.title || `Lesson ${lessonIndex + 1}`);

        return {
          id: createId("lesson"),
          moduleId: "",
          courseId: "",
          title: lessonTitle,
          slug: String(lessonRecord.slug || slugify(lessonTitle || `lesson-${lessonIndex + 1}`)),
          description: String(lessonRecord.description || ""),
          duration: String(lessonRecord.duration || ""),
          order: lessonIndex,
          blocks: Array.isArray(lessonRecord.blocks)
            ? (lessonRecord.blocks as AdminLesson["blocks"])
            : lessonRecord.content
              ? [
                  {
                    id: createId("block"),
                    type: "text" as const,
                    title: "",
                    content: String(lessonRecord.content),
                    url: null,
                    mediaId: null,
                    order: 0,
                  },
                ]
              : [],
          aiCoachPrompt: String(lessonRecord.aiCoachPrompt || ""),
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };
      });

      const moduleTitle = String(moduleRecord.title || `Module ${moduleIndex + 1}`);
      const moduleId = createId("mod");
      lessons.forEach((lesson) => {
        lesson.moduleId = moduleId;
      });

      return {
        id: moduleId,
        courseId: "",
        title: moduleTitle,
        slug: String(moduleRecord.slug || slugify(moduleTitle || `module-${moduleIndex + 1}`)),
        description: String(moduleRecord.description || ""),
        order: moduleIndex,
        lessons,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
    },
  );

  const courseId = createId("course");
  modules.forEach((moduleItem) => {
    moduleItem.courseId = courseId;
    moduleItem.lessons.forEach((lesson) => {
      lesson.courseId = courseId;
    });
  });

  const title = String(record.title);
  const description = String(record.description || "");
  const course: AdminCourse = {
    id: courseId,
    title,
    slug: String(record.slug || slugify(title)),
    subtitle: String(record.subtitle || ""),
    description,
    status: "draft",
    path: (["red", "white", "blue"].includes(String(record.path))
      ? String(record.path)
      : "white") as AdminCourse["path"],
    language: (record.language as AdminCourse["language"]) || "en",
    region: typeof record.region === "string" ? record.region : null,
    country: typeof record.country === "string" ? record.country : null,
    difficulty: (["beginner", "intermediate", "advanced"].includes(String(record.difficulty))
      ? String(record.difficulty)
      : "beginner") as AdminCourse["difficulty"],
    duration: String(record.duration || ""),
    membershipTier: (["free", "basic", "premium", "elite"].includes(
      String(record.membershipTier),
    )
      ? String(record.membershipTier)
      : "free") as AdminCourse["membershipTier"],
    instructorName: String(record.instructorName || ""),
    instructorBio: String(record.instructorBio || ""),
    thumbnailUrl: typeof record.thumbnailUrl === "string" ? record.thumbnailUrl : null,
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
    categories: Array.isArray(record.categories) ? record.categories.map(String) : [],
    prerequisites: Array.isArray(record.prerequisites)
      ? record.prerequisites.map(String)
      : [],
    learningObjectives: Array.isArray(record.learningObjectives)
      ? record.learningObjectives.map(String)
      : [],
    modules,
    seo: {
      metaTitle: String(seoRecord?.metaTitle || title || ""),
      metaDescription: String(seoRecord?.metaDescription || description || ""),
      ogImage: String(seoRecord?.ogImage || ""),
      keywords: Array.isArray(seoRecord?.keywords) ? seoRecord.keywords.map(String) : [],
      canonicalUrl: String(seoRecord?.canonicalUrl || ""),
    },
    relatedCourseIds: Array.isArray(record.relatedCourseIds)
      ? record.relatedCourseIds.map(String)
      : [],
    relatedMarketplaceIds: Array.isArray(record.relatedMarketplaceIds)
      ? record.relatedMarketplaceIds.map(String)
      : [],
    publishedAt: null,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
    createdBy: auth.session.email,
  };

  if (action === "preview") {
    return Response.json({
      ok: true,
      preview: course,
      moduleCount: modules.length,
      lessonCount: modules.reduce((sum, moduleItem) => sum + moduleItem.lessons.length, 0),
    });
  }

  await saveCourse(course);
  return Response.json({ ok: true, courseId: course.id, course });
}
