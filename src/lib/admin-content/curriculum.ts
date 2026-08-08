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
 */
export async function detectBundledCurriculumLessons(
  content: string,
): Promise<BundledCurriculumLesson[]> {
  const marker = /^CONTENT ID:\s*([A-Z]+-L\d-[0-9]{3})\s*$/gm;
  const matches = Array.from(content.matchAll(marker));
  if (matches.length === 0) return [];

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
