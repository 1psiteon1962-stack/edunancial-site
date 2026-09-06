import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, SupportedLanguage, UploadBatch } from "@/lib/admin-content/types";
import { inferUploadLanguageFromFilename, replaceDestinationLanguage } from "@/lib/admin-content/upload-intake";
import {
  exportPublishedLessonTranslations,
  importPublishedLessonTranslations,
  upsertPublishedLessonFromRegistry,
} from "@/lib/curriculum/authoritative-published";
import { getLessonContent } from "@/lib/curriculum/reader";

const LESSON_ID = /([A-Z]+-L\d+-\d{3})/u;
const CANONICAL_ENGLISH = new Set(["en", "en-us"]);
const PUBLISHED_STATE_PATH = "published/curriculum-state.json";

function normalizeLocale(locale: string | null | undefined): string | null {
  const value = locale?.trim();
  if (!value) return null;
  if (value.toLowerCase() === "en") return "en-US";
  return value;
}

function translationKey(lessonId: string, locale: string): string {
  return `${lessonId.trim().toUpperCase()}::${locale.trim().toLowerCase()}`;
}

async function readStoredTranslationKeys(): Promise<Set<string>> {
  const buffer = await getAdminContentStorage().readBinary(PUBLISHED_STATE_PATH);
  if (!buffer) return new Set();
  try {
    const parsed = JSON.parse(buffer.toString("utf8")) as {
      lessons?: Record<string, { translations?: Record<string, unknown> }>;
    };
    const keys = new Set<string>();
    for (const [lessonId, lesson] of Object.entries(parsed.lessons ?? {})) {
      for (const locale of Object.keys(lesson.translations ?? {})) {
        keys.add(translationKey(lessonId, locale));
      }
    }
    return keys;
  } catch {
    return new Set();
  }
}

function hasExactCommittedTranslation(lessonId: string, locale: string): boolean {
  const content = getLessonContent(lessonId, locale);
  if (!content) return false;
  return content.localization.translated === true
    && content.localization.resolution === "exact"
    && content.localization.resolvedLocale.toLowerCase() === locale.toLowerCase();
}

/** Resolve locale from the strongest available source. */
export function resolveLocalizedFileLocale(
  file: ExtractedFile,
  parentArchiveFilename?: string | null,
): string | null {
  return normalizeLocale(
    inferUploadLanguageFromFilename(file.originalFilename)
      ?? inferUploadLanguageFromFilename(file.normalizedFilename)
      ?? (file.sourceArchiveFilename ? inferUploadLanguageFromFilename(file.sourceArchiveFilename) : null)
      ?? (parentArchiveFilename ? inferUploadLanguageFromFilename(parentArchiveFilename) : null)
      ?? file.classification.language
      ?? file.metadata.language,
  );
}

export function isLocalizedCurriculumFile(
  file: ExtractedFile,
  parentArchiveFilename?: string | null,
): boolean {
  if (file.extension !== ".md") return false;
  const locale = resolveLocalizedFileLocale(file, parentArchiveFilename);
  return Boolean(locale && !CANONICAL_ENGLISH.has(locale.toLowerCase()));
}

function parseTranslatedMarkdown(raw: string): { frontMatter: Record<string, string>; body: string } {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("---")) return { frontMatter: {}, body: trimmed };
  const parts = trimmed.split("---");
  if (parts.length < 3) return { frontMatter: {}, body: trimmed };
  const frontMatter: Record<string, string> = {};
  for (const line of (parts[1] ?? "").split(/\r?\n/u)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) frontMatter[key] = value;
  }
  return { frontMatter, body: parts.slice(2).join("---").trim() };
}

function translatedTitle(body: string, lessonId: string, frontMatter: Record<string, string>): string | undefined {
  if (frontMatter.title?.trim()) return frontMatter.title.trim();
  const heading = body.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (!heading) return undefined;
  return heading.replace(new RegExp(`^${lessonId}:?\\s*`, "iu"), "").trim() || undefined;
}

export function extractLocalizedLessonTranslation(
  file: ExtractedFile,
  parentArchiveFilename?: string | null,
): {
  file: ExtractedFile;
  locale: string;
  lessonId: string;
  title?: string;
  summary?: string;
  body: string;
} | null {
  if (file.reviewStatus !== "approved" || file.extension !== ".md") return null;

  const locale = resolveLocalizedFileLocale(file, parentArchiveFilename);
  if (!locale || CANONICAL_ENGLISH.has(locale.toLowerCase())) return null;

  const lessonId = file.originalFilename.toUpperCase().match(LESSON_ID)?.[1]
    ?? file.normalizedFilename.toUpperCase().match(LESSON_ID)?.[1]
    ?? file.archivePath?.toUpperCase().match(LESSON_ID)?.[1];
  if (!lessonId) return null;

  const raw = Buffer.from(file.encodedContent, "base64").toString("utf8").trim();
  if (!raw) return null;

  const parsed = parseTranslatedMarkdown(raw);
  if (!parsed.body) return null;

  return {
    file,
    locale,
    lessonId,
    title: translatedTitle(parsed.body, lessonId, parsed.frontMatter),
    summary: parsed.frontMatter.summary?.trim() || parsed.frontMatter.description?.trim() || undefined,
    body: parsed.body,
  };
}

function localizedCandidates(batch: UploadBatch) {
  const archiveByUploadId = new Map(batch.uploads.map((upload) => [upload.id, upload.originalFilename]));
  return batch.files
    .map((file) => extractLocalizedLessonTranslation(file, archiveByUploadId.get(file.uploadId)))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

/**
 * The generic canonical publisher historically sees files such as GOLD-L1-001.md
 * inside a localized ZIP as canonical because the locale lives on the parent ZIP.
 * Restore the canonical registry copy immediately after that publish before
 * attaching the localized text as a translation delta.
 */
export async function restoreCanonicalLessonsAfterLocalizedPublish(batch: UploadBatch): Promise<{ attempted: number; restored: number; missingRegistryLessonIds: string[] }> {
  const lessonIds = [...new Set(localizedCandidates(batch).map((candidate) => candidate.lessonId))];
  let restored = 0;
  const missingRegistryLessonIds: string[] = [];
  for (const lessonId of lessonIds) {
    if (await upsertPublishedLessonFromRegistry(lessonId)) restored += 1;
    else missingRegistryLessonIds.push(lessonId);
  }
  return { attempted: lessonIds.length, restored, missingRegistryLessonIds };
}

export async function repairAndPublishLocalizedBatch(batch: UploadBatch): Promise<{ repaired: number; translated: number; skippedExisting: number; missingLessonIds: string[] }> {
  const candidates = localizedCandidates(batch);
  if (candidates.length === 0) return { repaired: 0, translated: 0, skippedExisting: 0, missingLessonIds: [] };

  const requestedLessonIds = [...new Set(candidates.map((candidate) => candidate.lessonId))];
  const canonical = await exportPublishedLessonTranslations({ lessonIds: requestedLessonIds });
  const existingLessonIds = new Set(
    canonical.filter((record) => record.title !== null).map((record) => record.id.toUpperCase()),
  );
  const missingLessonIds = requestedLessonIds.filter((lessonId) => !existingLessonIds.has(lessonId));
  const storedTranslationKeys = await readStoredTranslationKeys();

  let skippedExisting = 0;
  const publishable = candidates.filter((candidate) => {
    if (!existingLessonIds.has(candidate.lessonId)) return false;
    const alreadyStored = storedTranslationKeys.has(translationKey(candidate.lessonId, candidate.locale));
    const alreadyCommitted = hasExactCommittedTranslation(candidate.lessonId, candidate.locale);
    if (alreadyStored || alreadyCommitted) {
      skippedExisting += 1;
      return false;
    }
    return true;
  });

  const result = publishable.length > 0
    ? await importPublishedLessonTranslations(publishable.map(({ locale, lessonId, title, summary, body }) => ({
        lessonId,
        locale,
        ...(title ? { title } : {}),
        ...(summary ? { summary } : {}),
        body,
      })))
    : { updatedRecords: 0, updatedLessonIds: [], missingLessonIds: [] };

  const missing = new Set(missingLessonIds);
  const publishableKeys = new Set(publishable.map((candidate) => translationKey(candidate.lessonId, candidate.locale)));
  let repaired = 0;
  batch.files = batch.files.map((file) => {
    const candidate = candidates.find((entry) => entry.file.id === file.id);
    if (!candidate || missing.has(candidate.lessonId)) return file;
    repaired += 1;
    const language = candidate.locale as SupportedLanguage;
    const destination = replaceDestinationLanguage(file.classification.destination, candidate.locale);
    const imported = publishableKeys.has(translationKey(candidate.lessonId, candidate.locale));
    return {
      ...file,
      conflictStatus: "none",
      duplicateStatus: imported ? "new" : "exact-duplicate",
      classification: {
        ...file.classification,
        language,
        destination,
        reasons: [
          ...file.classification.reasons,
          imported ? `published-locale:${candidate.locale}` : `skipped-existing-locale:${candidate.locale}`,
        ],
      },
      metadata: { ...file.metadata, language, intendedDestination: destination },
      updatedAt: new Date().toISOString(),
    } satisfies ExtractedFile;
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = new Date().toISOString();
  await getAdminContentStorage().updateBatch(batch);
  return { repaired, translated: result.updatedRecords, skippedExisting, missingLessonIds };
}
