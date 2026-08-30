import { basename, extname } from "node:path";
import { COURSE_TRACKS, MEMBERSHIP_ACCESS, SUPPORTED_UPLOAD_LANGUAGES } from "@/lib/admin-content/constants";
import type { CourseTrack } from "@/lib/admin-content/constants";
import { slugify } from "@/lib/admin-content/utils";
export { COURSE_TRACKS, SUPPORTED_UPLOAD_LANGUAGES } from "@/lib/admin-content/constants";
export const CONTENT_DESTINATIONS = ["courses", "marketplace"] as const;
export const COURSE_LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;
export const PUBLICATION_STATES = ["draft", "review", "published", "archived"] as const;
export { MEMBERSHIP_ACCESS } from "@/lib/admin-content/constants";
export const SUPPORTED_REGIONS = ["north-america", "latin-america", "caribbean", "europe", "africa", "asia", "middle-east", "oceania", "global"] as const;
export const MARKETPLACE_CATEGORIES = ["books", "ebooks", "pdf-guides", "templates", "worksheets", "forms", "downloads", "zip-packages", "audio", "videos", "images", "software", "digital-products", "calculators", "presentations", "spreadsheets", "future-products"] as const;
export const CURRICULUM_FILENAME_LOCALES = ["es-Caribbean", "en-US", "en-GB", "es-ES", "fr-CA", "fr-FR", "pt-BR", "pt-PT", "de", "it", "nl", "es", "fr", "pt", "en"] as const;
export type ContentDestination = (typeof CONTENT_DESTINATIONS)[number];
export type { CourseTrack } from "@/lib/admin-content/constants";
export type CourseLevel = (typeof COURSE_LEVELS)[number];
export type PublicationState = (typeof PUBLICATION_STATES)[number];
export type MembershipAccess = (typeof MEMBERSHIP_ACCESS)[number];
export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];
export type UploadLanguage = (typeof SUPPORTED_UPLOAD_LANGUAGES)[number];
export type SupportedRegion = (typeof SUPPORTED_REGIONS)[number];
type UploadBaseConfig = { destination: ContentDestination; language: UploadLanguage; membershipAccess: MembershipAccess; publicationStatus: PublicationState; title: string; description: string; thumbnailUrl?: string | null; previewUrl?: string | null; };
export type CourseUploadConfig = UploadBaseConfig & { destination: "courses"; track: CourseTrack; level: CourseLevel; };
export type MarketplaceUploadConfig = UploadBaseConfig & { destination: "marketplace"; category: MarketplaceCategory; associatedTrack?: CourseTrack | null; associatedLevel?: CourseLevel | null; };
export type UploadConfig = CourseUploadConfig | MarketplaceUploadConfig;
function toOptionalText(value: unknown) { const text = String(value ?? "").trim(); return text.length > 0 ? text : null; }
function assertOneOf<T extends readonly string[]>(value: string, allowed: T, message: string): T[number] { if (!allowed.includes(value)) throw new Error(message); return value as T[number]; }
export function parseUploadConfig(formData: FormData): UploadConfig {
  const destination = assertOneOf(String(formData.get("contentDestination") ?? "").trim().toLowerCase(), CONTENT_DESTINATIONS, "Content destination is required. Choose COURSES or MARKETPLACE.");
  const title = String(formData.get("title") ?? "").trim(); const description = String(formData.get("description") ?? "").trim();
  const language = assertOneOf(String(formData.get("language") ?? "en").trim(), SUPPORTED_UPLOAD_LANGUAGES, "Language is required.");
  const membershipAccess = assertOneOf(String(formData.get("membershipAccess") ?? "free").trim(), MEMBERSHIP_ACCESS, "Membership access is required.");
  const publicationStatus = assertOneOf(String(formData.get("publicationStatus") ?? "draft").trim(), PUBLICATION_STATES, "Publication status is required.");
  const thumbnailUrl = toOptionalText(formData.get("thumbnailUrl")); const previewUrl = toOptionalText(formData.get("previewUrl"));
  if (!title) throw new Error("Course/Marketplace title is required."); if (!description) throw new Error("Course/Marketplace description is required.");
  if (destination === "courses") return { destination, track: assertOneOf(String(formData.get("courseTrack") ?? "").trim().toLowerCase(), COURSE_TRACKS, "Course color track is required."), level: assertOneOf(String(formData.get("courseLevel") ?? "").trim().toLowerCase(), COURSE_LEVELS, "Course level is required."), language, membershipAccess, publicationStatus, title, description, thumbnailUrl, previewUrl };
  return { destination, category: assertOneOf(String(formData.get("marketplaceCategory") ?? "").trim().toLowerCase(), MARKETPLACE_CATEGORIES, "Marketplace category is required."), associatedTrack: toOptionalText(formData.get("associatedTrack")) as CourseTrack | null, associatedLevel: toOptionalText(formData.get("associatedLevel")) as CourseLevel | null, language, membershipAccess, publicationStatus, title, description, thumbnailUrl, previewUrl };
}
export function canonicalUploadLanguage(language: string): string { if (language === "en") return "en-US"; if (language === "fr") return "fr-FR"; if (language === "pt") return "pt-BR"; return language.trim(); }

function filenameTokens(filename: string): string[] {
  const stem = basename(filename, extname(filename)).toLowerCase();
  return stem.split(/[^a-z0-9]+/).filter(Boolean);
}

const HUMAN_LANGUAGE_ALIASES: Array<[string, UploadLanguage]> = [
  ["spanish-latin-america-caribbean", "es-Caribbean"],
  ["spanish-caribbean", "es-Caribbean"],
  ["portuguese-brazil", "pt-BR"],
  ["brazilian-portuguese", "pt-BR"],
  ["portuguese-portugal", "pt-PT"],
  ["french-canadian", "fr-CA"],
  ["canadian-french", "fr-CA"],
  ["french-france", "fr-FR"],
  ["spanish-spain", "es-ES"],
  ["english-uk", "en-GB"],
  ["english-united-kingdom", "en-GB"],
  ["english-us", "en-US"],
  ["english-united-states", "en-US"],
  ["german-germany", "de"],
  ["italian-italy", "it"],
  ["dutch-netherlands", "nl"],
];

export function inferUploadLanguageFromFilename(filename: string): string | null {
  const stem = basename(filename, extname(filename)).toLowerCase();
  const normalized = `-${stem.replaceAll("_", "-").replaceAll(".", "-")}-`;
  for (const [alias, locale] of HUMAN_LANGUAGE_ALIASES) {
    if (normalized.includes(`-${alias}-`)) return locale;
  }
  for (const locale of CURRICULUM_FILENAME_LOCALES) {
    const candidate = locale.toLowerCase();
    if (normalized.includes(`-${candidate}-`)) return locale;
  }
  return null;
}

const TRACK_ALIASES: Record<string, CourseTrack> = {
  red: "red", white: "white", blue: "blue", green: "green", gold: "gold", purple: "purple", orange: "orange", black: "black",
};

export function inferCourseTrackFromFilename(filename: string): CourseTrack | null {
  for (const token of filenameTokens(filename)) {
    if (TRACK_ALIASES[token]) return TRACK_ALIASES[token];
  }
  return null;
}

export function inferCourseLevelFromFilename(filename: string): CourseLevel | null {
  const tokens = filenameTokens(filename);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const compact = token.match(/^l([1-5])$/) ?? token.match(/^level([1-5])$/);
    if (compact) return `level-${compact[1]}` as CourseLevel;
    if (token === "level" && /^[1-5]$/.test(tokens[index + 1] ?? "")) return `level-${tokens[index + 1]}` as CourseLevel;
  }
  return null;
}

export function inferCurriculumTitleFromFilename(filename: string): string | null {
  const stem = basename(filename, extname(filename));
  const tokens = stem.split(/[-_.\s]+/).filter(Boolean);
  const localeTokens = new Set([
    ...CURRICULUM_FILENAME_LOCALES.flatMap((locale) => locale.toLowerCase().split("-")),
    "english", "united", "states", "uk", "kingdom", "spanish", "latin", "america", "caribbean", "spain",
    "french", "canadian", "france", "portuguese", "brazil", "portugal", "brazilian", "german", "germany",
    "italian", "italy", "dutch", "netherlands",
  ]);
  const metadataTokens = new Set(["complete", "combined", "package", "curriculum", "level", ...Object.keys(TRACK_ALIASES)]);
  const titleTokens = tokens.filter((token) => {
    const lower = token.toLowerCase();
    if (metadataTokens.has(lower) || localeTokens.has(lower)) return false;
    if (/^l[1-5]$/i.test(token) || /^level[1-5]$/i.test(token) || /^[1-5]$/.test(token)) return false;
    return true;
  });
  return titleTokens.length > 0 ? titleTokens.join(" ") : null;
}

export function resolveUploadFileLanguage(configLanguage: UploadLanguage, filename: string): string { return inferUploadLanguageFromFilename(filename) ?? configLanguage; }
function normalizeLanguage(language: string) { return language.replaceAll("-", "_").toLowerCase(); }
export function replaceDestinationLanguage(destination: string, language: string): string { const parts = destination.split("/"); if (parts[0] === "content" && parts[1] === "courses" && parts.length >= 6) { parts[4] = normalizeLanguage(language); return parts.join("/"); } if (parts[0] === "content" && parts[1] === "marketplace" && parts.length >= 5) { parts[3] = normalizeLanguage(language); return parts.join("/"); } return destination; }
export function replaceCourseDestinationIdentity(destination: string, track: CourseTrack, level: CourseLevel, language: string): string {
  const parts = destination.split("/");
  if (parts[0] === "content" && parts[1] === "courses" && parts.length >= 6) {
    parts[2] = track;
    parts[3] = level;
    parts[4] = normalizeLanguage(language);
    return parts.join("/");
  }
  return destination;
}
export function buildIntendedDestination(config: UploadConfig, filename: string, uploadId: string) { const extension = extname(filename).toLowerCase() || ".bin"; const fileStem = slugify(basename(filename, extname(filename))); const uniqueSuffix = fileStem || uploadId.slice(-8); const safeName = `${slugify(config.title)}-${uniqueSuffix}${extension}`; const fileLanguage = config.destination === "courses" ? resolveUploadFileLanguage(config.language, filename) : config.language; if (config.destination === "courses") return `content/courses/${config.track}/${config.level}/${normalizeLanguage(fileLanguage)}/${safeName}`; return `content/marketplace/${config.category}/${normalizeLanguage(fileLanguage)}/${safeName}`; }
export function toAcademyLevel(level: CourseLevel | null) { return level; }
