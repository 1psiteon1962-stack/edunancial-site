import { repairAndPublishLocalizedBatch } from "@/lib/admin-content/localized-batch-repair";
import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { validateCompleteCurriculumPackage } from "@/lib/admin-content/curriculum-package-validation";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { UploadBatch } from "@/lib/admin-content/types";
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

export async function autoPublishTrustedLocalizedLevel1Batch(
  batch: UploadBatch,
  identity: PackageIdentity | null,
  options: { requireAtomic?: boolean } = {},
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
  const validatedFiles = validateCompleteCurriculumPackage(batch, identity).files;
  const validatedIds = new Set(validatedFiles.map((file) => file.id));
  const approvedFiles = validatedFiles.length;
  batch.files = batch.files.map((file) => {
    if (!validatedIds.has(file.id)) return file;
    return {
      ...file,
      reviewStatus: "approved",
      approvedAt,
      rejectedAt: null,
      metadata: { ...file.metadata, publicationStatus: "published" },
      updatedAt: approvedAt,
    };
  });

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  const localization = await repairAndPublishLocalizedBatch(batch, { requireAtomic: options.requireAtomic });
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
