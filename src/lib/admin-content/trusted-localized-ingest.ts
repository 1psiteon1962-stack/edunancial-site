import { repairAndPublishLocalizedBatch } from "@/lib/admin-content/localized-batch-repair";
import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { UploadBatch } from "@/lib/admin-content/types";
import { backfillMissingPublishedLessonsFromRegistry } from "@/lib/curriculum/published-registry-backfill";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const AUTO_PUBLISH_TRACKS = new Set(["gold", "green", "purple", "orange", "black"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);

export function isTrustedLocalizedLevel1Identity(identity: PackageIdentity | null): boolean {
  return Boolean(identity
    && identity.level === "level-1"
    && AUTO_PUBLISH_TRACKS.has(identity.track)
    && !CANONICAL_ENGLISH.has(identity.language));
}

function lessonMatchesPackage(file: UploadBatch["files"][number], identity: PackageIdentity): boolean {
  if (file.extension !== ".md") return false;
  const track = identity.track.toUpperCase();
  const match = file.originalFilename.toUpperCase().match(new RegExp(`^${track}-L1-(\\d{3})(?:[.-]|$)`, "u"))
    ?? file.normalizedFilename.toUpperCase().match(new RegExp(`^${track}-L1-(\\d{3})(?:[.-]|$)`, "u"))
    ?? file.archivePath?.toUpperCase().match(new RegExp(`(?:^|/)${track}-L1-(\\d{3})(?:[.-]|$)`, "u"));
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

  if (approvedFiles === 0) {
    throw new Error(`Localized curriculum package ${identity.track}/${identity.language} contained no valid Level 1 lesson files.`);
  }

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
