import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, UploadBatch } from "@/lib/admin-content/types";
import { upsertPublishedLessonsFromBatch } from "@/lib/curriculum/authoritative-published";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const TRUSTED_TRACKS = new Set(["red", "white", "blue", "green", "gold", "purple", "orange", "black"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);
const TRUSTED_LEVELS = new Set(["level-1", "level-2", "level-3", "level-4", "level-5"]);

export function isTrustedCanonicalCurriculumIdentity(identity: PackageIdentity | null): boolean {
  return Boolean(identity && TRUSTED_TRACKS.has(identity.track) && TRUSTED_LEVELS.has(identity.level) && CANONICAL_ENGLISH.has(identity.language));
}

function lessonNumberForPackage(file: UploadBatch["files"][number], identity: PackageIdentity): number | null {
  if (file.extension !== ".md") return null;
  const track = identity.track.toUpperCase();
  const levelMatch = identity.level.match(/^level-([1-5])$/u);
  if (!levelMatch) return null;
  const level = `L${levelMatch[1]}`;
  const pattern = new RegExp(`^${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const archivePattern = new RegExp(`(?:^|/)${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const match = file.originalFilename.toUpperCase().match(pattern) ?? file.normalizedFilename.toUpperCase().match(pattern) ?? file.archivePath?.toUpperCase().match(archivePattern);
  if (!match) return null;
  const lessonNumber = Number(match[1]);
  return lessonNumber >= 1 && lessonNumber <= 50 ? lessonNumber : null;
}

export async function autoPublishTrustedCanonicalCurriculumBatch(
  batch: UploadBatch,
  identity: PackageIdentity | null,
  _actor: ActorContext,
  options: { publish?: boolean } = {},
): Promise<{ attempted: boolean; approvedFiles: number; publishedLessons?: number }> {
  if (!isTrustedCanonicalCurriculumIdentity(identity) || !identity) return { attempted: false, approvedFiles: 0 };

  const numbered = batch.files.map((file) => ({ file, lessonNumber: lessonNumberForPackage(file, identity) }));
  const canonical = numbered.filter((entry) => entry.lessonNumber !== null);
  const lessonNumbers = new Set(canonical.map((entry) => entry.lessonNumber as number));
  const unsafeFiles = batch.files.filter((file) => file.processingStatus === "error" || file.conflictStatus !== "none" || file.duplicateStatus !== "new");
  if (canonical.length !== 50 || lessonNumbers.size !== 50 || unsafeFiles.length > 0) {
    throw new Error(`Trusted curriculum package ${identity.track}/${identity.level}/${identity.language} failed publication validation: canonical=${canonical.length}, uniqueLessons=${lessonNumbers.size}, unsafeFiles=${unsafeFiles.length}. Expected exactly 50 unique lessons with no conflicts, duplicates, or processing errors.`);
  }
  for (let lesson = 1; lesson <= 50; lesson += 1) if (!lessonNumbers.has(lesson)) throw new Error(`Trusted curriculum package is missing lesson ${String(lesson).padStart(3, "0")}.`);

  const approvedAt = new Date().toISOString();
  const canonicalIds = new Set(canonical.map((entry) => entry.file.id));
  batch.files = batch.files.map((file) => canonicalIds.has(file.id) ? {
    ...file,
    reviewStatus: "approved" as const,
    approvedAt,
    rejectedAt: null,
    metadata: { ...file.metadata, publicationStatus: options.publish === false ? file.metadata.publicationStatus : "published" },
    updatedAt: approvedAt,
  } : file);
  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  // The upload itself is already durable in admin-content-storage. Publish the
  // validated canonical lessons into the same authoritative runtime curriculum
  // state used by the learner catalog instead of opening a second GitHub PR.
  if (options.publish === false) return { attempted: true, approvedFiles: 50 };

  const published = await upsertPublishedLessonsFromBatch(batch);
  if (published.upserted !== 50) {
    throw new Error(`Trusted curriculum publication for ${identity.track}/${identity.level}/${identity.language} published ${published.upserted} of 50 lessons.`);
  }

  invalidateRegistryCache();
  await revalidatePublishedCurriculumRoutes(identity.track);
  return { attempted: true, approvedFiles: 50, publishedLessons: published.upserted };
}
