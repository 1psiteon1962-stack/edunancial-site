import { repairAndPublishLocalizedBatch } from "@/lib/admin-content/localized-batch-repair";
import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { UploadBatch } from "@/lib/admin-content/types";
import { backfillMissingPublishedLessonsFromRegistry } from "@/lib/curriculum/published-registry-backfill";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const AUTO_PUBLISH_TRACKS = new Set(["red", "white", "blue", "green", "gold", "purple", "orange", "black"]);
const AUTO_PUBLISH_LEVELS = new Set(["level-1", "level-2", "level-3", "level-4", "level-5"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);

export function isTrustedLocalizedLevel1Identity(identity: PackageIdentity | null): boolean {
  return Boolean(identity
    && AUTO_PUBLISH_LEVELS.has(identity.level)
    && AUTO_PUBLISH_TRACKS.has(identity.track)
    && !CANONICAL_ENGLISH.has(identity.language));
}

function lessonMatchesPackage(file: UploadBatch["files"][number], identity: PackageIdentity): boolean {
  if (file.extension !== ".md") return false;
  const track = identity.track.toUpperCase();
  const levelMatch = identity.level.match(/^level-([1-5])$/u);
  if (!levelMatch) return false;
  const prefix = `${track}-L${levelMatch[1]}-`;
  const pattern = new RegExp(`^${prefix}(\\d{3})(?:[.-]|$)`, "u");
  const archivePattern = new RegExp(`(?:^|/)${prefix}(\\d{3})(?:[.-]|$)`, "u");
  const match = file.originalFilename.toUpperCase().match(pattern)
    ?? file.normalizedFilename.toUpperCase().match(pattern)
    ?? file.archivePath?.toUpperCase().match(archivePattern);
  if (!match) return false;
  const lessonNumber = Number(match[1]);
  return lessonNumber >= 1 && lessonNumber <= 50;
}

export async function autoPublishTrustedLocalizedLevel1Batch(
  batch: UploadBatch,
  identity: PackageIdentity | null,
): Promise<{
  attempted: boolean;
  approvedFiles: number;
  translated: number;
  skippedExisting: number;
  missingLessonIds: string[];
}> {
  if (!isTrustedLocalizedLevel1Identity(identity) || !identity) {
    return { attempted: false, approvedFiles: 0, translated: 0, skippedExisting: 0, missingLessonIds: [] };
  }

  const approvedAt = new Date().toISOString();
  let approvedFiles = 0;
  batch.files = batch.files.map((file) => {
    if (!lessonMatchesPackage(file, identity)) return file;
    approvedFiles += 1;
    return {
      ...file,
      reviewStatus: "approved",
      approvedAt,
      rejectedAt: null,
      metadata: { ...file.metadata, publicationStatus: "published" },
      updatedAt: approvedAt,
    };
  });

  const lessonNumbers = new Set(batch.files.filter((file) => lessonMatchesPackage(file, identity)).map((file) => {
    const match = `${file.originalFilename} ${file.normalizedFilename} ${file.archivePath ?? ""}`.toUpperCase().match(/-L[1-5]-(\\d{3})/u);
    return match ? Number(match[1]) : null;
  }).filter((value): value is number => value !== null));
  const unsafeFiles = batch.files.filter((file) => file.processingStatus === "error" || file.conflictStatus !== "none" || file.duplicateStatus !== "new");
  if (approvedFiles !== 50 || lessonNumbers.size !== 50 || unsafeFiles.length > 0) {
    throw new Error(`Localized curriculum package ${identity.track}/${identity.level}/${identity.language} failed publication validation: approved=${approvedFiles}, uniqueLessons=${lessonNumbers.size}, unsafeFiles=${unsafeFiles.length}. Expected exactly 50 unique lessons with no conflicts, duplicates, or processing errors.`);
  }
  for (let lesson = 1; lesson <= 50; lesson += 1) if (!lessonNumbers.has(lesson)) throw new Error(`Localized curriculum package is missing lesson ${String(lesson).padStart(3, "0")}.`);

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  await backfillMissingPublishedLessonsFromRegistry([identity.track.toUpperCase()]);

  const localization = await repairAndPublishLocalizedBatch(batch);
  if (localization.missingLessonIds.length > 0 || localization.translated !== approvedFiles) {
    throw new Error(
      `Localized publication incomplete for ${identity.track}/${identity.language}: published ${localization.translated} of ${approvedFiles}; missing canonical lessons: ${localization.missingLessonIds.join(", ") || "none"}.`,
    );
  }

  invalidateRegistryCache();
  await revalidatePublishedCurriculumRoutes(identity.track);

  return {
    attempted: true,
    approvedFiles,
    translated: localization.translated,
    skippedExisting: localization.skippedExisting,
    missingLessonIds: localization.missingLessonIds,
  };
}
