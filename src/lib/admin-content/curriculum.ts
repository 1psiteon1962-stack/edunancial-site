import { createHash } from "node:crypto";
import { extname } from "node:path";

export async function validateCurriculumFiles(files: Array<{ destination: string; content: string }>) {
  const relevant = files.filter((file) => file.destination.startsWith("content/curriculum/") && extname(file.destination).toLowerCase() === ".md");
  if (relevant.length === 0) {
    return { success: true, warnings: ["No curriculum-bound markdown files required validation."], errors: [] as string[] };
  }

  const validator = await import("../../../scripts/curriculum/lib/validator.mjs");
  const idParser = await import("../../../scripts/curriculum/lib/id-parser.mjs");
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const file of relevant) {
    const match = file.destination.match(/([A-Z]+-L\d-[A-Z0-9-]+)(?:\.[A-Za-z0-9-]+)?\.md$/);
    const assetId = match?.[1];
    if (!assetId) {
      warnings.push(`${file.destination} does not map to a canonical curriculum asset ID.`);
      continue;
    }
    const parsed = idParser.parseAssetId(assetId);
    if (!parsed.valid) {
      errors.push(`${assetId}: ${parsed.error}`);
      continue;
    }
    const result = validator.validateAsset(file.content, assetId);
    warnings.push(...result.warnings.map((warning: string) => `${assetId}: ${warning}`));
    errors.push(...result.errors.map((error: string) => `${assetId}: ${error}`));
  }

  return { success: errors.length === 0, warnings, errors };
}

// ---------------------------------------------------------------------------
// Curriculum asset detection and registry-entry construction
//
// These helpers allow the GitHub PR creation step to:
//   1. Detect markdown files that contain valid curriculum front-matter.
//   2. Override their destination path to the canonical curriculum location.
//   3. Build an updated curriculum/registry.json to include in the same commit.
//
// This makes the upload → registry → curriculum → lesson-rendering pipeline
// fully automatic: no manual `npm run curriculum:import` or code changes are
// required when adding RED-111.md, WHITE-205.md, or any future lesson file.
// ---------------------------------------------------------------------------

export type ParsedCurriculumAsset = {
  id: string;
  type: "lesson" | "manifest" | "batch-verification";
  track: string;
  trackName: string;
  level: number;
  number?: number;
  canonicalPath: string;
  destinationPath: string;
  locale?: string;
  frontMatter: Record<string, string>;
  validationPassed: boolean;
  warnings: string[];
};

export type BundledCurriculumLesson = {
  asset: ParsedCurriculumAsset;
  content: string;
};

// Type helpers for the dynamically imported curriculum script modules.
// These match the shapes returned by the .mjs files at runtime; TypeScript
// cannot infer them automatically because .mjs imports are untyped.
type ParsedAsset = {
  valid: boolean;
  type?: string;
  track?: string;
  trackName?: string;
  level?: number;
  number?: number;
  id?: string;
  error?: string;
};

type ValidationResult = {
  valid: boolean;
  warnings: string[];
  errors: string[];
};

/**
 * Attempt to parse a markdown file's front-matter and determine whether it
 * contains a valid curriculum asset ID.  Returns null when the file is not a
 * recognised curriculum asset so the caller can skip it gracefully.
 */
export async function detectCurriculumAsset(
  content: string,
  sourceFilename?: string,
): Promise<ParsedCurriculumAsset | null> {
  try {
    const idParser = await import("../../../scripts/curriculum/lib/id-parser.mjs") as {
      parseAssetId: (id: string) => ParsedAsset;
      assetPath: (parsed: ParsedAsset) => string;
    };
    const validator = await import("../../../scripts/curriculum/lib/validator.mjs") as {
      parseFrontMatter: (content: string) => Record<string, string> | null;
      validateAsset: (content: string, id: string) => ValidationResult;
    };

    const fm = validator.parseFrontMatter(content);
    if (!fm || !fm.id) return null;

    const parsed = idParser.parseAssetId(fm.id);
    if (!parsed.valid) return null;

    const canonicalPath = idParser.assetPath(parsed);
    const localeMatch = sourceFilename?.match(/\.([A-Za-z0-9-]+)\.md$/u);
    const locale = localeMatch?.[1];
    const validation = validator.validateAsset(content, fm.id);

    return {
      id: fm.id,
      type: (parsed.type ?? "lesson") as "lesson" | "manifest" | "batch-verification",
      track: parsed.track ?? "",
      trackName: parsed.trackName ?? "",
      level: parsed.level ?? 0,
      number: parsed.number,
      canonicalPath,
      destinationPath:
        locale && canonicalPath.endsWith(".md")
          ? canonicalPath.replace(/\.md$/u, `.${locale}.md`)
          : canonicalPath,
      locale,
      frontMatter: fm,
      validationPassed: validation.valid,
      warnings: validation.warnings,
    };
  } catch {
    return null;
  }
}

function parseBundledMetadata(section: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  for (const line of section.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) break;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex <= 0) continue;
    const key = trimmed.slice(0, colonIndex).trim().toUpperCase();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (key && value) metadata[key] = value;
  }
  return metadata;
}

/**
 * Parse a "combined" uploaded curriculum markdown file that contains multiple
 * `CONTENT ID: TRACK-Lx-yyy` blocks and derive canonical per-lesson markdown.
 *
 * Also handles the heading-style admin upload format where lessons appear as
 * `# TRACK-Lx-yyy-MAIN` sections with `**Lesson ID:** TRACK-Lx-yyy` metadata.
 */
export async function detectBundledCurriculumLessons(
  content: string,
): Promise<BundledCurriculumLesson[]> {
  const marker = /^CONTENT ID:\s*([A-Z]+-L\d-[0-9]{3})\s*$/gm;
  const matches = Array.from(content.matchAll(marker));

  // Fallback: detect the heading-style admin upload format.
  // Files uploaded via admin dashboard use "# TRACK-Lx-yyy-MAIN" headings
  // and "**Lesson ID:** TRACK-Lx-yyy" metadata instead of CONTENT ID markers.
  if (matches.length === 0) {
    return detectHeadingStyleCurriculumLessons(content);
  }

  const lessons: BundledCurriculumLesson[] = [];
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const sectionStart = current.index ?? 0;
    const sectionEnd = next?.index ?? content.length;
    const section = content.slice(sectionStart, sectionEnd).trim();
    const metadata = parseBundledMetadata(section);
    const headingStart = section.search(/^#\s+/m);
    if (headingStart < 0) continue;

    const id = current[1];
    const track = metadata["TRACK"] ?? id.split("-")[0];
    const levelFromId = id.match(/-L(\d)-/)?.[1] ?? "1";
    const lessonNumberFromId = id.match(/-([0-9]{3})$/)?.[1] ?? "1";
    const level = Number(metadata["LEVEL"] ?? levelFromId);
    const lessonNumber = Number(metadata["LESSON NUMBER"] ?? lessonNumberFromId);
    const title = metadata["LESSON TITLE"] ?? id;
    const author = metadata["AUTHOR"] ?? "Edunancial Faculty";
    const version = metadata["VERSION"] ?? "1.0";
    const date = metadata["DATE"] ?? metadata["LAST REVIEW DATE"] ?? new Date().toISOString().slice(0, 10);
    const officialTrackName = metadata["OFFICIAL TRACK NAME"] ?? "";
    const body = section.slice(headingStart).trim();

    const canonicalLesson = [
      "---",
      `id: ${id}`,
      `track: ${track}`,
      `officialTrackName: ${officialTrackName}`,
      `level: ${level}`,
      `lessonNumber: ${lessonNumber}`,
      `title: ${title}`,
      `version: ${version}`,
      `author: ${author}`,
      `date: ${date}`,
      "---",
      "",
      body,
      "",
    ].join("\n");

    const asset = await detectCurriculumAsset(canonicalLesson);
    if (asset) {
      lessons.push({
        asset,
        content: canonicalLesson,
      });
    }
  }

  return lessons;
}

/**
 * Detect curriculum lessons in the heading-style admin upload format.
 *
 * Files produced by the admin dashboard batch upload tool use a structured
 * heading format instead of CONTENT ID markers:
 *
 *   # TRACK-Lx-yyy-MAIN
 *   ## Lesson Title
 *
 *   **Lesson ID:** TRACK-Lx-yyy
 *   **Track:** TRACK (Track Name)
 *   **Level:** x
 *   **Author:** Author Name
 *
 * Only the `-MAIN` section is extracted and converted to the canonical
 * front-matter format so the validator and registry pipeline can process it.
 * Auxiliary sections (`-ANSWER-KEY`, `-SEO`, `-AI`, `-LOCALIZATION`,
 * `-REFERENCES`, `-COMPETENCY`) are intentionally excluded from the canonical
 * lesson file as they are not consumed by the curriculum reader.
 */
async function detectHeadingStyleCurriculumLessons(
  content: string,
): Promise<BundledCurriculumLesson[]> {
  // Match headings like "# RED-L2-001-MAIN" or "# RED-L2-001-main"
  const mainSectionPattern = /^# ([A-Z]+-L\d-[0-9]{3})-MAIN\s*$/gim;
  const mainMatches = Array.from(content.matchAll(mainSectionPattern));
  if (mainMatches.length === 0) return [];

  const lessons: BundledCurriculumLesson[] = [];

  for (const mainMatch of mainMatches) {
    const id = mainMatch[1].toUpperCase();
    const sectionStart = mainMatch.index ?? 0;

    // Find the end of the MAIN section: next level-1 heading that is a different
    // section suffix (e.g. "# RED-L2-001-ANSWER-KEY") or end of file.
    const nextSectionPattern = /^# [A-Z]+-L\d-[0-9]{3}-(?!MAIN)/im;
    const afterMain = content.slice(sectionStart + mainMatch[0].length);
    const nextMatch = afterMain.search(nextSectionPattern);
    const sectionEnd = nextMatch >= 0
      ? sectionStart + mainMatch[0].length + nextMatch
      : content.length;

    const mainBody = content.slice(sectionStart, sectionEnd).trim();

    // Extract metadata from bold-label lines: **Lesson ID:** RED-L2-001
    const metaLine = (label: string) => {
      const m = mainBody.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)(?:\\n|$)`, "i"));
      return m?.[1]?.trim() ?? "";
    };

    const lessonId = metaLine("Lesson ID") || id;
    const trackRaw = metaLine("Track");
    const track = trackRaw.match(/^([A-Z]+)/)?.[1] ?? id.split("-")[0];
    const levelRaw = metaLine("Level");
    const levelFromId = id.match(/-L(\d)-/)?.[1] ?? "1";
    const level = Number(levelRaw.match(/\d+/)?.[0] ?? levelFromId);
    const lessonNumberFromId = Number(id.match(/-([0-9]{3})$/)?.[1] ?? "1");
    const authorRaw = metaLine("Author");
    const author = authorRaw || "Edunancial Faculty";

    // Extract title: first ## heading after the # MAIN heading
    const titleMatch = mainBody.match(/^## (.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? id;

    // Extract summary from Executive Summary section
    const summaryMatch = mainBody.match(/## Executive Summary\s+\n+([\s\S]+?)(?:\n\n## |\n##)/);
    const summary = summaryMatch?.[1]?.replace(/\n/g, " ").trim().slice(0, 220) ?? "";

    const today = new Date().toISOString().slice(0, 10);

    // Extract Learning Objectives and Main Lesson body for the canonical file.
    // Strip the executive summary block and auxiliary metadata lines.
    const coreMatch = mainBody.match(/(## Learning Objectives[\s\S]+)/);
    const coreBody = coreMatch?.[1]?.trim() ?? mainBody;

    const officialTrackNameResolved = trackRaw.replace(/^[A-Z]+\s*\((.+)\)$/, "$1") || track;
    const canonicalLesson = [
      "---",
      `id: ${lessonId}`,
      `track: ${track}`,
      `officialTrackName: ${officialTrackNameResolved}`,
      `level: ${level}`,
      `lessonNumber: ${lessonNumberFromId}`,
      `title: ${title}`,
      `summary: ${summary}`,
      `version: 1.0`,
      `author: ${author}`,
      `date: ${today}`,
      "---",
      "",
      coreBody,
      "",
    ].join("\n");

    const asset = await detectCurriculumAsset(canonicalLesson);
    if (asset) {
      lessons.push({ asset, content: canonicalLesson });
    }
  }

  return lessons;
}


export type CurriculumRegistryEntry = {
  id: string;
  type: string;
  track: string;
  trackName: string;
  level: number;
  lessonNumber?: number;
  title: string;
  version: string;
  author: string;
  date: string;
  path: string;
  checksum: string;
  status: "active";
  ingestionId: string;
  importedAt: string;
  validationPassed: boolean;
  warnings: string[];
  metadata: Record<string, string>;
};

export type CurriculumRegistry = {
  _schema: string;
  _version: string;
  _generated: string;
  _note: string;
  tracks: Record<
    string,
    {
      code: string;
      name: string;
      levels: Record<string, { assets: Record<string, CurriculumRegistryEntry> }>;
    }
  >;
};

const RESERVED_FM_KEYS = new Set([
  "id",
  "track",
  "officialTrackName",
  "level",
  "lessonNumber",
  "title",
  "version",
  "author",
  "date",
]);

/**
 * Build a registry entry for a detected curriculum asset.  The `checksum`
 * field uses the sha256 hex of the raw file content; callers that already have
 * a pre-computed checksum can pass it directly to avoid double-hashing.
 */
export function buildRegistryEntry(
  asset: ParsedCurriculumAsset,
  contentBytes: Buffer,
  ingestionId: string,
  importedAt: string,
  existingChecksum?: string,
): CurriculumRegistryEntry {
  const checksum = existingChecksum ?? "sha256:" + createHash("sha256").update(contentBytes).digest("hex");
  const fm = asset.frontMatter;

  const extraMetadata = Object.fromEntries(
    Object.entries(fm).filter(([k]) => !RESERVED_FM_KEYS.has(k)),
  );

  return {
    id: asset.id,
    type: asset.type,
    track: asset.track,
    trackName: asset.trackName,
    level: asset.level,
    lessonNumber: asset.type === "lesson" ? (parseInt(fm.lessonNumber ?? "", 10) || asset.number) : undefined,
    title: fm.title ?? "",
    version: fm.version ?? "1.0",
    author: fm.author ?? "",
    date: fm.date ?? "",
    path: asset.canonicalPath,
    checksum,
    status: "active",
    ingestionId,
    importedAt,
    validationPassed: asset.validationPassed,
    warnings: asset.warnings,
    metadata: {
      officialTrackName: fm.officialTrackName ?? asset.trackName,
      ...extraMetadata,
    },
  };
}

/**
 * Merge one or more registry entries into an existing registry object.  The
 * existing registry may be null (first import) or an already-parsed JSON
 * object.  Returns the updated registry as a plain object — callers are
 * responsible for serialising it and including it in the GitHub commit tree.
 */
export function upsertRegistryEntries(
  existingRegistry: CurriculumRegistry | null,
  entries: CurriculumRegistryEntry[],
): CurriculumRegistry {
  const registry: CurriculumRegistry = existingRegistry ?? {
    _schema: "curriculum/schemas/registry.schema.json",
    _version: "1.0",
    _generated: new Date().toISOString(),
    _note: "Authoritative curriculum registry. Edit only via curriculum:import or curriculum:migrate-legacy.",
    tracks: {},
  };

  registry._generated = new Date().toISOString();

  for (const entry of entries) {
    if (!registry.tracks[entry.track]) {
      registry.tracks[entry.track] = {
        code: entry.track,
        name: entry.trackName,
        levels: {},
      };
    }
    const levelKey = String(entry.level);
    if (!registry.tracks[entry.track].levels[levelKey]) {
      registry.tracks[entry.track].levels[levelKey] = { assets: {} };
    }
    registry.tracks[entry.track].levels[levelKey].assets[entry.id] = entry;
  }

  return registry;
}
