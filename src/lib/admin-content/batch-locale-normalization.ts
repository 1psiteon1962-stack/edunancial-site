import { deriveBatchStatus, toDuplicateStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, SupportedLanguage, UploadBatch } from "@/lib/admin-content/types";
import {
  inferCourseLevelFromFilename,
  inferCourseTrackFromFilename,
  inferCurriculumTitleFromFilename,
  inferUploadLanguageFromFilename,
  replaceCourseDestinationIdentity,
} from "@/lib/admin-content/upload-intake";
import { normalizeSimilarityText, nowIso } from "@/lib/admin-content/utils";

function canonicalLocale(locale: string): string {
  const value = locale.trim().toLowerCase();
  if (value === "en") return "en-us";
  if (value === "fr") return "fr-fr";
  if (value === "pt") return "pt-br";
  return value;
}

function sourceNames(file: ExtractedFile): string[] {
  return [file.sourceArchiveFilename, file.originalFilename, file.normalizedFilename].filter(
    (value): value is string => Boolean(value),
  );
}

function inferredLocale(file: ExtractedFile): string | null {
  for (const name of sourceNames(file)) {
    const value = inferUploadLanguageFromFilename(name);
    if (value) return value;
  }
  return null;
}

function inferredTrack(file: ExtractedFile) {
  for (const name of sourceNames(file)) {
    const value = inferCourseTrackFromFilename(name);
    if (value) return value;
  }
  return null;
}

function inferredLevel(file: ExtractedFile) {
  for (const name of sourceNames(file)) {
    const value = inferCourseLevelFromFilename(name);
    if (value) return value;
  }
  return null;
}

function inferredTitle(file: ExtractedFile): string | null {
  const sourceArchive = file.sourceArchiveFilename;
  if (sourceArchive) return inferCurriculumTitleFromFilename(sourceArchive);
  return null;
}

function sameCurriculumIdentity(a: ExtractedFile, b: ExtractedFile): boolean {
  return (
    a.metadata.pillar === b.metadata.pillar &&
    a.metadata.academyLevel === b.metadata.academyLevel &&
    canonicalLocale(String(a.metadata.language)) === canonicalLocale(String(b.metadata.language))
  );
}

function curriculumAwareConflict(current: ExtractedFile, candidates: ExtractedFile[]) {
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
 * Converts a broad browser upload into per-package curriculum metadata after ZIP
 * extraction. Filename/package metadata wins over the form defaults whenever it
 * can be inferred. This permits one selection to contain mixed colors, levels,
 * languages and course titles; the form values remain safe fallbacks only.
 */
export async function normalizeMixedLocaleBatch(batch: UploadBatch): Promise<UploadBatch> {
  let changed = false;

  batch.files = batch.files.map((file) => {
    if (file.classification.category !== "courses") return file;

    const locale = inferredLocale(file) ?? String(file.metadata.language);
    const track = inferredTrack(file) ?? file.classification.pillar;
    const level = inferredLevel(file) ?? file.classification.academyLevel;
    const title = inferredTitle(file) ?? file.metadata.title;

    if (!track || track === "uncategorized" || !level) return file;

    const destination = replaceCourseDestinationIdentity(
      file.classification.destination,
      track as Parameters<typeof replaceCourseDestinationIdentity>[1],
      level as Parameters<typeof replaceCourseDestinationIdentity>[2],
      locale,
    );

    const identityChanged =
      canonicalLocale(String(file.metadata.language)) !== canonicalLocale(locale) ||
      file.metadata.pillar !== track ||
      file.metadata.academyLevel !== level ||
      file.metadata.title !== title ||
      file.classification.destination !== destination;

    if (!identityChanged) return file;
    changed = true;

    const language = locale as SupportedLanguage;
    const reasons = [...file.classification.reasons];
    if (canonicalLocale(String(file.metadata.language)) !== canonicalLocale(locale)) reasons.push(`filename-locale:${locale}`);
    if (file.metadata.pillar !== track) reasons.push(`filename-track:${track}`);
    if (file.metadata.academyLevel !== level) reasons.push(`filename-level:${level}`);
    if (file.metadata.title !== title && file.sourceArchiveFilename) reasons.push(`archive-title:${file.sourceArchiveFilename}`);

    return {
      ...file,
      classification: {
        ...file.classification,
        language,
        pillar: track,
        academyLevel: level,
        destination,
        reasons,
      },
      metadata: {
        ...file.metadata,
        title,
        language,
        pillar: track,
        academyLevel: level,
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
    const conflictStatus = curriculumAwareConflict(file, [...priorFiles, ...batch.files]);
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
