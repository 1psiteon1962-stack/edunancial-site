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
    const match = file.destination.match(/([A-Z]+-L\d+-[A-Z0-9-]+)(?:\.[A-Za-z0-9-]+)?\.md$/);
    const assetId = match?.[1];
    if (!assetId) { warnings.push(`${file.destination} does not map to a canonical curriculum asset ID.`); continue; }
    const parsed = idParser.parseAssetId(assetId);
    if (!parsed.valid) { errors.push(`${assetId}: ${parsed.error}`); continue; }
    const result = validator.validateAsset(file.content, assetId);
    warnings.push(...result.warnings.map((warning: string) => `${assetId}: ${warning}`));
    errors.push(...result.errors.map((error: string) => `${assetId}: ${error}`));
  }
  return { success: errors.length === 0, warnings, errors };
}

export type ParsedCurriculumAsset = {
  id: string; type: "lesson" | "manifest" | "batch-verification"; track: string; trackName: string;
  level: number; number?: number; canonicalPath: string; destinationPath: string; locale?: string;
  frontMatter: Record<string, string>; validationPassed: boolean; warnings: string[];
};
export type BundledCurriculumLesson = { asset: ParsedCurriculumAsset; content: string };
type ParsedAsset = { valid: boolean; type?: string; track?: string; trackName?: string; level?: number; number?: number; id?: string; error?: string };
type ValidationResult = { valid: boolean; warnings: string[]; errors: string[] };

export async function detectCurriculumAsset(content: string, sourceFilename?: string): Promise<ParsedCurriculumAsset | null> {
  try {
    const idParser = await import("../../../scripts/curriculum/lib/id-parser.mjs") as { parseAssetId: (id: string) => ParsedAsset; assetPath: (parsed: ParsedAsset) => string };
    const validator = await import("../../../scripts/curriculum/lib/validator.mjs") as { parseFrontMatter: (content: string) => Record<string, string> | null; validateAsset: (content: string, id: string) => ValidationResult };
    const fm = validator.parseFrontMatter(content);
    if (!fm || !fm.id) return null;
    const parsed = idParser.parseAssetId(fm.id);
    if (!parsed.valid) return null;
    const canonicalPath = idParser.assetPath(parsed);
    const localeMatch = sourceFilename?.match(/\.([A-Za-z0-9-]+)\.md$/u);
    const locale = localeMatch?.[1];
    const validation = validator.validateAsset(content, fm.id);
    return { id: fm.id, type: (parsed.type ?? "lesson") as ParsedCurriculumAsset["type"], track: parsed.track ?? "", trackName: parsed.trackName ?? "", level: parsed.level ?? 0, number: parsed.number, canonicalPath, destinationPath: locale && canonicalPath.endsWith(".md") ? canonicalPath.replace(/\.md$/u, `.${locale}.md`) : canonicalPath, locale, frontMatter: fm, validationPassed: validation.valid, warnings: validation.warnings };
  } catch { return null; }
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

const TRACK_NAMES: Record<string, string> = {
  RED: "Real Estate", WHITE: "Paper Assets", BLUE: "Business", GREEN: "Personal Finance and Taxes",
  GOLD: "Investing", PURPLE: "Law", ORANGE: "Sales and Marketing", BLACK: "Leadership",
};

function metadataLine(section: string, label: string): string {
  const match = section.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)(?:\\n|$)`, "i"));
  return match?.[1]?.trim() ?? "";
}

async function canonicalizeLesson(id: string, section: string): Promise<BundledCurriculumLesson | null> {
  const idMatch = id.match(/^([A-Z][A-Z0-9]*)-L([1-9][0-9]*)-([0-9]{3,})$/u);
  if (!idMatch) return null;
  const [, track, levelRaw, numberRaw] = idMatch;
  const level = Number(levelRaw);
  const lessonNumber = Number(numberRaw);
  const trackRaw = metadataLine(section, "Track");
  const officialTrackName = trackRaw.match(/^[A-Z][A-Z0-9]*\s*\((.+)\)$/u)?.[1] ?? TRACK_NAMES[track] ?? track;
  const author = metadataLine(section, "Author") || "Edunancial Faculty";
  const explicitTitle = metadataLine(section, "Lesson Title");
  const lines = section.split(/\r?\n/);
  const firstContentHeading = lines.find((line, index) => index > 0 && /^#{1,6}\s+/.test(line) && !new RegExp(`^#{1,6}\\s+${id}\\s*$`, "i").test(line));
  const title = explicitTitle || firstContentHeading?.replace(/^#{1,6}\s+/, "").trim() || id;
  const summaryMatch = section.match(/(?:^|\n)#{1,6}\s+Executive Summary\s*\n+([\s\S]+?)(?=\n#{1,6}\s+|$)/i);
  const summary = summaryMatch?.[1]?.replace(/\s+/g, " ").trim().slice(0, 220) ?? "";
  const today = new Date().toISOString().slice(0, 10);
  const canonicalLesson = ["---", `id: ${id}`, `track: ${track}`, `officialTrackName: ${officialTrackName}`, `level: ${level}`, `lessonNumber: ${lessonNumber}`, `title: ${title}`, ...(summary ? [`summary: ${summary}`] : []), "version: 1.0", `author: ${author}`, `date: ${today}`, "---", "", section.trim(), ""].join("\n");
  const asset = await detectCurriculumAsset(canonicalLesson);
  return asset ? { asset, content: canonicalLesson } : null;
}

async function detectSimpleMasterCurriculumLessons(content: string): Promise<BundledCurriculumLesson[]> {
  // Claude/master format: each lesson begins with a heading such as ## RED-L2-001.
  // Level and lesson number are deliberately unbounded so the same ingestion path
  // supports Levels 1-5 today and future levels/counts without an architectural ceiling.
  const pattern = /^#{1,6}\s+([A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,})\s*$/gim;
  const matches = Array.from(content.matchAll(pattern));
  if (matches.length === 0) return [];
  const ids = matches.map((match) => match[1].toUpperCase());
  if (new Set(ids).size !== ids.length) throw new Error("Curriculum master bundle contains duplicate lesson IDs.");
  const identity = ids[0].match(/^([A-Z][A-Z0-9]*)-L([1-9][0-9]*)-/u);
  if (!identity) return [];
  const [, expectedTrack, expectedLevel] = identity;
  for (const id of ids) {
    const current = id.match(/^([A-Z][A-Z0-9]*)-L([1-9][0-9]*)-([0-9]{3,})$/u);
    if (!current || current[1] !== expectedTrack || current[2] !== expectedLevel) throw new Error(`Curriculum master bundle mixes track/level identities: ${id}.`);
  }
  const numbers = ids.map((id) => Number(id.match(/-([0-9]{3,})$/u)?.[1]));
  for (let i = 1; i < numbers.length; i += 1) {
    if (numbers[i] !== numbers[i - 1] + 1) throw new Error(`Curriculum master bundle has a non-sequential lesson ID between ${ids[i - 1]} and ${ids[i]}.`);
  }
  const lessons: BundledCurriculumLesson[] = [];
  for (let index = 0; index < matches.length; index += 1) {
    const start = matches[index].index ?? 0;
    const end = matches[index + 1]?.index ?? content.length;
    const lesson = await canonicalizeLesson(ids[index], content.slice(start, end).trim());
    if (!lesson) throw new Error(`Curriculum master bundle lesson ${ids[index]} could not be canonicalized.`);
    lessons.push(lesson);
  }
  return lessons;
}

export async function detectBundledCurriculumLessons(content: string): Promise<BundledCurriculumLesson[]> {
  const marker = /^CONTENT ID:\s*([A-Z]+-L\d+-[0-9]{3,})\s*$/gm;
  const matches = Array.from(content.matchAll(marker));
  if (matches.length === 0) {
    const headingStyle = await detectHeadingStyleCurriculumLessons(content);
    if (headingStyle.length > 0) return headingStyle;
    return detectSimpleMasterCurriculumLessons(content);
  }
  const lessons: BundledCurriculumLesson[] = [];
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]; const next = matches[index + 1];
    const section = content.slice(current.index ?? 0, next?.index ?? content.length).trim();
    const metadata = parseBundledMetadata(section);
    const headingStart = section.search(/^#\s+/m);
    if (headingStart < 0) continue;
    const id = current[1]; const track = metadata["TRACK"] ?? id.split("-")[0];
    const levelFromId = id.match(/-L(\d+)-/)?.[1] ?? "1"; const lessonNumberFromId = id.match(/-([0-9]{3,})$/)?.[1] ?? "1";
    const level = Number(metadata["LEVEL"] ?? levelFromId); const lessonNumber = Number(metadata["LESSON NUMBER"] ?? lessonNumberFromId);
    const title = metadata["LESSON TITLE"] ?? id; const author = metadata["AUTHOR"] ?? "Edunancial Faculty"; const version = metadata["VERSION"] ?? "1.0";
    const date = metadata["DATE"] ?? metadata["LAST REVIEW DATE"] ?? new Date().toISOString().slice(0, 10); const officialTrackName = metadata["OFFICIAL TRACK NAME"] ?? TRACK_NAMES[track] ?? track;
    const body = section.slice(headingStart).trim();
    const canonicalLesson = ["---", `id: ${id}`, `track: ${track}`, `officialTrackName: ${officialTrackName}`, `level: ${level}`, `lessonNumber: ${lessonNumber}`, `title: ${title}`, `version: ${version}`, `author: ${author}`, `date: ${date}`, "---", "", body, ""].join("\n");
    const asset = await detectCurriculumAsset(canonicalLesson); if (asset) lessons.push({ asset, content: canonicalLesson });
  }
  return lessons;
}

async function detectHeadingStyleCurriculumLessons(content: string): Promise<BundledCurriculumLesson[]> {
  const mainSectionPattern = /^# ([A-Z]+-L\d+-[0-9]{3,})-MAIN\s*$/gim;
  const mainMatches = Array.from(content.matchAll(mainSectionPattern)); if (mainMatches.length === 0) return [];
  const lessons: BundledCurriculumLesson[] = [];
  for (const mainMatch of mainMatches) {
    const id = mainMatch[1].toUpperCase(); const sectionStart = mainMatch.index ?? 0;
    const afterMain = content.slice(sectionStart + mainMatch[0].length); const nextMatch = afterMain.search(/^# [A-Z]+-L\d+-[0-9]{3,}-(?!MAIN)/im);
    const sectionEnd = nextMatch >= 0 ? sectionStart + mainMatch[0].length + nextMatch : content.length;
    const lesson = await canonicalizeLesson(id, content.slice(sectionStart, sectionEnd).trim()); if (lesson) lessons.push(lesson);
  }
  return lessons;
}

export type CurriculumRegistryEntry = { id: string; type: string; track: string; trackName: string; level: number; lessonNumber?: number; title: string; version: string; author: string; date: string; path: string; checksum: string; status: "active"; ingestionId: string; importedAt: string; validationPassed: boolean; warnings: string[]; metadata: Record<string, string> };
export type CurriculumRegistry = { _schema: string; _version: string; _generated: string; _note: string; tracks: Record<string, { code: string; name: string; levels: Record<string, { assets: Record<string, CurriculumRegistryEntry> }> }> };
const RESERVED_FM_KEYS = new Set(["id", "track", "officialTrackName", "level", "lessonNumber", "title", "version", "author", "date"]);
export function buildRegistryEntry(asset: ParsedCurriculumAsset, contentBytes: Buffer, ingestionId: string, importedAt: string, existingChecksum?: string): CurriculumRegistryEntry {
  const checksum = existingChecksum ?? "sha256:" + createHash("sha256").update(contentBytes).digest("hex"); const fm = asset.frontMatter;
  const extraMetadata = Object.fromEntries(Object.entries(fm).filter(([k]) => !RESERVED_FM_KEYS.has(k)));
  return { id: asset.id, type: asset.type, track: asset.track, trackName: asset.trackName, level: asset.level, lessonNumber: asset.type === "lesson" ? (parseInt(fm.lessonNumber ?? "", 10) || asset.number) : undefined, title: fm.title ?? "", version: fm.version ?? "1.0", author: fm.author ?? "", date: fm.date ?? "", path: asset.canonicalPath, checksum, status: "active", ingestionId, importedAt, validationPassed: asset.validationPassed, warnings: asset.warnings, metadata: { officialTrackName: fm.officialTrackName ?? asset.trackName, ...extraMetadata } };
}
export function upsertRegistryEntries(existingRegistry: CurriculumRegistry | null, entries: CurriculumRegistryEntry[]): CurriculumRegistry {
  const registry: CurriculumRegistry = existingRegistry ?? { _schema: "curriculum/schemas/registry.schema.json", _version: "1.0", _generated: new Date().toISOString(), _note: "Authoritative curriculum registry. Edit only via curriculum:import or curriculum:migrate-legacy.", tracks: {} };
  registry._generated = new Date().toISOString();
  for (const entry of entries) {
    if (!registry.tracks[entry.track]) registry.tracks[entry.track] = { code: entry.track, name: entry.trackName, levels: {} };
    const levelKey = String(entry.level); if (!registry.tracks[entry.track].levels[levelKey]) registry.tracks[entry.track].levels[levelKey] = { assets: {} };
    registry.tracks[entry.track].levels[levelKey].assets[entry.id] = entry;
  }
  return registry;
}
