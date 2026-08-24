import { deriveBatchStatus, toDuplicateStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, SupportedLanguage, UploadBatch } from "@/lib/admin-content/types";
import { inferUploadLanguageFromFilename, replaceDestinationLanguage } from "@/lib/admin-content/upload-intake";
import { normalizeSimilarityText, nowIso } from "@/lib/admin-content/utils";

function canonicalLocale(locale: string): string {
  const value = locale.trim().toLowerCase();
  if (value === "en") return "en-us";
  if (value === "fr") return "fr-fr";
  if (value === "pt") return "pt-br";
  return value;
}

function inferredLocale(file: ExtractedFile): string | null {
  return (
    inferUploadLanguageFromFilename(file.originalFilename) ??
    inferUploadLanguageFromFilename(file.normalizedFilename) ??
    (file.sourceArchiveFilename ? inferUploadLanguageFromFilename(file.sourceArchiveFilename) : null)
  );
}

function sameCurriculumIdentity(a: ExtractedFile, b: ExtractedFile): boolean {
  return (
    a.metadata.pillar === b.metadata.pillar &&
    a.metadata.academyLevel === b.metadata.academyLevel &&
    canonicalLocale(String(a.metadata.language)) === canonicalLocale(String(b.metadata.language))
  );
}

function localeAwareConflict(current: ExtractedFile, candidates: ExtractedFile[]) {
  for (const existing of candidates) {
    if (existing.id === current.id || !sameCurriculumIdentity(current, existing)) continue;
    if (existing.checksum === current.checksum) return "exact-duplicate" as const;
    if (existing.classification.destination === current.classification.destination && existing.checksum !== current.checksum) {
      return "destination-conflict" as const;
    }
    if (existing.normalizedFilename === current.normalizedFilename && existing.checksum !== current.checksum) {
      return "revision" as const;
    }
    if (
      current.rawText &&
      existing.rawText &&
      normalizeSimilarityText(current.rawText).slice(0, 200) === normalizeSimilarityText(existing.rawText).slice(0, 200)
    ) {
      return "probable-duplicate" as const;
    }
  }
  return "none" as const;
}

/**
 * Normalizes curriculum language after ZIP extraction. The locale may be on the
 * lesson filename or only on the source ZIP filename. This permits one batch to
 * contain multiple language ZIPs for the same color/level without assigning the
 * batch fallback language to every extracted lesson.
 */
export async function normalizeMixedLocaleBatch(batch: UploadBatch): Promise<UploadBatch> {
  let changed = false;

  batch.files = batch.files.map((file) => {
    const locale = inferredLocale(file);
    if (!locale || file.classification.category !== "courses") return file;

    const destination = replaceDestinationLanguage(file.classification.destination, locale);
    const currentLocale = canonicalLocale(String(file.metadata.language));
    const nextLocale = canonicalLocale(locale);
    if (currentLocale === nextLocale && destination === file.classification.destination) return file;

    changed = true;
    const language = locale as SupportedLanguage;
    return {
      ...file,
      classification: {
        ...file.classification,
        language,
        destination,
        reasons: [...file.classification.reasons, `filename-locale:${locale}`],
      },
      metadata: {
        ...file.metadata,
        language,
        intendedDestination: destination,
      },
      updatedAt: nowIso(),
    } satisfies ExtractedFile;
  });

  if (!changed) return batch;

  const storage = getAdminContentStorage();
  const summaries = await storage.listBatches();
  const priorBatches = await Promise.all(
    summaries
      .filter((summary) => summary.id !== batch.id)
      .slice(0, 50)
      .map((summary) => storage.getBatch(summary.id)),
  );
  const priorFiles = priorBatches.flatMap((entry) => entry?.files ?? []);

  batch.files = batch.files.map((file) => {
    const conflictStatus = localeAwareConflict(file, [...priorFiles, ...batch.files]);
    return {
      ...file,
      conflictStatus,
      duplicateStatus: toDuplicateStatus(conflictStatus, file.processingStatus === "error"),
      updatedAt: nowIso(),
    } satisfies ExtractedFile;
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = nowIso();
  await storage.updateBatch(batch);
  return batch;
}
