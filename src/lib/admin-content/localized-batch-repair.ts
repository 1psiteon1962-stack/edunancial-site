import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, SupportedLanguage, UploadBatch } from "@/lib/admin-content/types";
import { inferUploadLanguageFromFilename, replaceDestinationLanguage } from "@/lib/admin-content/upload-intake";
import { importPublishedLessonTranslations } from "@/lib/curriculum/authoritative-published";

const LESSON_ID = /([A-Z]+-L\d+-\d{3})/u;
const CANONICAL_ENGLISH = new Set(["en", "en-us"]);

function normalizeLocale(locale: string | null | undefined): string | null {
  const value = locale?.trim();
  if (!value) return null;
  if (value.toLowerCase() === "en") return "en-US";
  return value;
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

export async function repairAndPublishLocalizedBatch(batch: UploadBatch): Promise<{ repaired: number; translated: number; missingLessonIds: string[] }> {
  const archiveByUploadId = new Map(batch.uploads.map((upload) => [upload.id, upload.originalFilename]));
  const candidates = batch.files
    .map((file) => extractLocalizedLessonTranslation(file, archiveByUploadId.get(file.uploadId)))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (candidates.length === 0) return { repaired: 0, translated: 0, missingLessonIds: [] };

  const result = await importPublishedLessonTranslations(candidates.map(({ locale, lessonId, title, summary, body }) => ({
    lessonId,
    locale,
    ...(title ? { title } : {}),
    ...(summary ? { summary } : {}),
    body,
  })));

  const missing = new Set(result.missingLessonIds);
  let repaired = 0;
  batch.files = batch.files.map((file) => {
    const candidate = candidates.find((entry) => entry.file.id === file.id);
    if (!candidate || missing.has(candidate.lessonId)) return file;
    repaired += 1;
    const language = candidate.locale as SupportedLanguage;
    const destination = replaceDestinationLanguage(file.classification.destination, candidate.locale);
    return {
      ...file,
      conflictStatus: "none",
      duplicateStatus: "new",
      classification: {
        ...file.classification,
        language,
        destination,
        reasons: [...file.classification.reasons, `published-locale:${candidate.locale}`],
      },
      metadata: { ...file.metadata, language, intendedDestination: destination },
      updatedAt: new Date().toISOString(),
    } satisfies ExtractedFile;
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = new Date().toISOString();
  await getAdminContentStorage().updateBatch(batch);
  return { repaired, translated: result.updatedRecords, missingLessonIds: result.missingLessonIds };
}
