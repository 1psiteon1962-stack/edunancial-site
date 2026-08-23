import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, SupportedLanguage, UploadBatch } from "@/lib/admin-content/types";
import { inferUploadLanguageFromFilename, replaceDestinationLanguage } from "@/lib/admin-content/upload-intake";
import { importPublishedLessonTranslations } from "@/lib/curriculum/authoritative-published";

const LESSON_ID = /([A-Z]+-L\d+-\d{3})/u;

function translatedTitle(raw: string, lessonId: string): string | undefined {
  const heading = raw.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (!heading) return undefined;
  return heading.replace(new RegExp(`^${lessonId}:?\\s*`, "iu"), "").trim() || undefined;
}

export async function repairAndPublishLocalizedBatch(batch: UploadBatch): Promise<{ repaired: number; translated: number; missingLessonIds: string[] }> {
  const candidates = batch.files.flatMap((file) => {
    if (file.reviewStatus !== "approved" || file.extension !== ".md") return [];
    const locale = inferUploadLanguageFromFilename(file.originalFilename) ?? inferUploadLanguageFromFilename(file.normalizedFilename);
    const lessonId = file.originalFilename.toUpperCase().match(LESSON_ID)?.[1] ?? file.normalizedFilename.toUpperCase().match(LESSON_ID)?.[1];
    if (!locale || !lessonId || locale.toLowerCase().startsWith("en")) return [];
    const raw = Buffer.from(file.encodedContent, "base64").toString("utf8").trim();
    if (!raw) return [];
    return [{ file, locale, lessonId, raw }];
  });

  if (candidates.length === 0) return { repaired: 0, translated: 0, missingLessonIds: [] };

  const result = await importPublishedLessonTranslations(candidates.map(({ locale, lessonId, raw }) => ({
    lessonId,
    locale,
    title: translatedTitle(raw, lessonId),
    body: raw,
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
      classification: { ...file.classification, language, destination, reasons: [...file.classification.reasons, `filename-locale:${candidate.locale}`] },
      metadata: { ...file.metadata, language, intendedDestination: destination },
      updatedAt: new Date().toISOString(),
    } satisfies ExtractedFile;
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = new Date().toISOString();
  await getAdminContentStorage().updateBatch(batch);
  return { repaired, translated: result.updatedRecords, missingLessonIds: result.missingLessonIds };
}
