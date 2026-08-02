import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

const REGISTRY_PATH = join(process.cwd(), "curriculum", "registry.json");

function lessonFilePath(track: string, level: number, id: string): string {
  return join(process.cwd(), `content/curriculum/${track}/L${level}/${id}.md`);
}

type RegistryTrack = {
  code: string;
  name: string;
  levels: Record<string, {
    assets: Record<string, unknown>;
  }>;
};

type RegistryShape = {
  _schema: string;
  _version: string;
  _generated: string;
  _note: string;
  tracks: Record<string, RegistryTrack>;
};

function readRegistry(): RegistryShape {
  if (!existsSync(REGISTRY_PATH)) {
    return {
      _schema: "curriculum/schemas/registry.schema.json",
      _version: "1.0",
      _generated: new Date().toISOString(),
      _note: "Authoritative curriculum registry.",
      tracks: {},
    };
  }
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as RegistryShape;
}

function trackNameFromCode(code: string): string {
  const names: Record<string, string> = {
    RED: "Real Estate",
    WHITE: "Paper Assets",
    BLUE: "Business",
  };
  return names[code] ?? code;
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: {
    track?: string;
    level?: number;
    lessonNumber?: number;
    title?: string;
    summary?: string;
    author?: string;
    content?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { track, level, lessonNumber, title, summary, author, content } = body;

  if (!track || typeof track !== "string") {
    return NextResponse.json({ error: "track is required (e.g. RED, WHITE, BLUE)" }, { status: 400 });
  }
  if (typeof level !== "number" || level < 1) {
    return NextResponse.json({ error: "level must be a positive integer" }, { status: 400 });
  }
  if (typeof lessonNumber !== "number" || lessonNumber < 1) {
    return NextResponse.json({ error: "lessonNumber must be a positive integer" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content (markdown body) is required" }, { status: 400 });
  }

  const trackUpper = track.toUpperCase();
  const lessonNumStr = String(lessonNumber).padStart(3, "0");
  const lessonId = `${trackUpper}-L${level}-${lessonNumStr}`;
  const filePath = lessonFilePath(trackUpper, level, lessonId);
  const canonicalPath = `content/curriculum/${trackUpper}/L${level}/${lessonId}.md`;

  // Check for duplicate
  if (existsSync(filePath)) {
    return NextResponse.json(
      { error: `Lesson ${lessonId} already exists. Use the edit endpoint to update it.` },
      { status: 409 },
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const authorName = (typeof author === "string" && author.trim()) ? author.trim() : "Edunancial Faculty";
  const summaryText = (typeof summary === "string" && summary.trim()) ? summary.trim() : "";

  const frontMatter = [
    "---",
    `id: ${lessonId}`,
    `track: ${trackUpper}`,
    `officialTrackName: ${trackNameFromCode(trackUpper)}`,
    `level: ${level}`,
    `lessonNumber: ${lessonNumber}`,
    `title: ${title}`,
    `version: 1.0`,
    `author: ${authorName}`,
    `date: ${today}`,
    summaryText ? `summary: ${summaryText}` : null,
    "---",
  ].filter(Boolean).join("\n");

  const fullContent = `${frontMatter}\n\n${content}`;

  // Ensure directory exists
  const dir = join(process.cwd(), `content/curriculum/${trackUpper}/L${level}`);
  mkdirSync(dir, { recursive: true });

  // Write lesson file
  await writeFile(filePath, fullContent, "utf8");

  // Update registry
  const registry = readRegistry();
  const checksum = "sha256:" + createHash("sha256").update(fullContent).digest("hex");
  const now = new Date().toISOString();
  const ingestionId = `admin-add-${Date.now()}`;
  const trackName = trackNameFromCode(trackUpper);

  if (!registry.tracks[trackUpper]) {
    registry.tracks[trackUpper] = { code: trackUpper, name: trackName, levels: {} };
  }
  const levelKey = String(level);
  if (!registry.tracks[trackUpper].levels[levelKey]) {
    registry.tracks[trackUpper].levels[levelKey] = { assets: {} };
  }

  registry.tracks[trackUpper].levels[levelKey].assets[lessonId] = {
    id: lessonId,
    type: "lesson",
    track: trackUpper,
    trackName,
    level,
    lessonNumber,
    title,
    version: "1.0",
    author: authorName,
    date: today,
    path: canonicalPath,
    checksum,
    status: "active",
    ingestionId,
    importedAt: now,
    validationPassed: true,
    warnings: [],
    metadata: {
      officialTrackName: trackName,
      ...(summaryText ? { summary: summaryText } : {}),
    },
  };

  registry._generated = now;
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
  invalidateRegistryCache();

  return NextResponse.json({
    ok: true,
    lessonId,
    filePath: canonicalPath,
    message: `Lesson ${lessonId} created successfully.`,
  });
}
