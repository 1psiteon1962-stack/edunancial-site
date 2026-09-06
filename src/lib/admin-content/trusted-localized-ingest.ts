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

/**
 * Owner-trusted ingestion path for the current Level 1 translation recovery.
 *
 * Scope is intentionally narrow:
 * - GOLD/GREEN/PURPLE/ORANGE/BLACK only
 * - Level 1 only
 * - localized packages only (never canonical US English)
 * - only lesson markdown whose identity matches the package track and L1
 *
 * Valid lesson files are approved and attached directly to published curriculum
 * state. Existing lesson+locale translations are preserved by
 * repairAndPublishLocalizedBatch; only missing slots are filled. RED/WHITE/BLUE
 * and canonical English are never modified by this path.
 */
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
  if (!identity
    || identity.level !== "level-1"
    || !AUTO_PUBLISH_TRACKS.has(identity.track)
    || CANONICAL_ENGLISH.has(identity.language)) {
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
    return { attempted: true, approvedFiles: 0, translated: 0, skippedExisting: 0, missingLessonIds: [] };
  }

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  // Ensure the matching canonical US-English lesson records exist without
  // touching the protected RED/WHITE/BLUE tracks.
  await backfillMissingPublishedLessonsFromRegistry([identity.track.toUpperCase()]);

  const localization = await repairAndPublishLocalizedBatch(batch);
  invalidateRegistryCache();
  await revalidatePublishedCurriculumRoutes();

  return {
    attempted: true,
    approvedFiles,
    translated: localization.translated,
    skippedExisting: localization.skippedExisting,
    missingLessonIds: localization.missingLessonIds,
  };
}
