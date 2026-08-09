import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { removePublishedLesson } from "@/lib/curriculum/authoritative-published";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");
const CURRICULUM_ROOT = resolve(process.cwd(), "content", "curriculum");

function lessonFilePath(id: string): string | null {
  const match = id.match(/^([A-Z]+)-L(\d+)-(\d{3})$/);
  if (!match) return null;
  const [, track, level] = match;
  const candidate = resolve(CURRICULUM_ROOT, track, `L${level}`, `${id}.md`);
  if (!candidate.startsWith(`${CURRICULUM_ROOT}${sep}`)) {
    return null;
  }
  return candidate;
}

function removeFromRegistry(lessonId: string) {
  if (!existsSync(REGISTRY_PATH)) return;
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as {
    _generated: string;
    tracks: Record<string, {
      levels: Record<string, {
        assets: Record<string, unknown>;
      }>;
    }>;
  };

  let modified = false;
  for (const track of Object.values(registry.tracks)) {
    for (const level of Object.values(track.levels)) {
      if (level.assets[lessonId]) {
        delete level.assets[lessonId];
        modified = true;
      }
    }
  }

  if (modified) {
    registry._generated = new Date().toISOString();
    writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
    invalidateRegistryCache();
  }
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

  let fileDeleted = false;
  if (existsSync(filePath)) {
    await unlink(filePath);
    fileDeleted = true;
  }

  // Remove from registry so it no longer appears in the curriculum
  removeFromRegistry(lessonId);
  await removePublishedLesson(lessonId);
  await revalidatePublishedCurriculumRoutes();

  return NextResponse.json({
    ok: true,
    message: fileDeleted
      ? `Lesson ${lessonId} deleted.`
      : `Lesson ${lessonId} removed from curriculum records.`,
  });
}
