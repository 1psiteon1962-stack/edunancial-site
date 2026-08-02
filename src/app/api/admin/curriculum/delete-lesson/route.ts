import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");

function lessonFilePath(id: string): string | null {
  const match = id.match(/^([A-Z]+)-L(\d+)-(\d{3})$/);
  if (!match) return null;
  const [, track, level] = match;
  return join(process.cwd(), `content/curriculum/${track}/L${level}/${id}.md`);
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

  try {
    await unlink(filePath);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return NextResponse.json({ error: "Lesson file not found" }, { status: 404 });
    }
    throw err;
  }

  // Remove from registry so it no longer appears in the curriculum
  removeFromRegistry(lessonId);

  return NextResponse.json({ ok: true, message: `Lesson ${lessonId} deleted.` });
}
