import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { validateCompleteCurriculumPackage } from "@/lib/admin-content/curriculum-package-validation";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, UploadBatch } from "@/lib/admin-content/types";
import { upsertPublishedLessonsFromBatch } from "@/lib/curriculum/authoritative-published";
import { publishNeonLessonsTransaction } from "@/lib/curriculum/neon-transactional-publisher";
import { extractPublishedLessonsFromBatch } from "@/lib/curriculum/authoritative-published";
import type { PublicationLease } from "@/lib/admin-content/publication-lock";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";

const TRUSTED_TRACKS = new Set(["red", "white", "blue", "green", "gold", "purple", "orange", "black"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);
const TRUSTED_LEVELS = new Set(["level-1", "level-2", "level-3", "level-4", "level-5"]);

export function isTrustedCanonicalCurriculumIdentity(identity: PackageIdentity | null): boolean {
  return Boolean(identity && TRUSTED_TRACKS.has(identity.track) && TRUSTED_LEVELS.has(identity.level) && CANONICAL_ENGLISH.has(identity.language));
}

export async function autoPublishTrustedCanonicalCurriculumBatch(
  batch: UploadBatch,
  identity: PackageIdentity | null,
  _actor: ActorContext,
  options: { publish?: boolean; requireAtomic?: boolean; uploadId?: string; lease?: PublicationLease } = {},
): Promise<{ attempted: boolean; approvedFiles: number; publishedLessons?: number }> {
  if (!isTrustedCanonicalCurriculumIdentity(identity) || !identity) return { attempted: false, approvedFiles: 0 };

  const canonical = validateCompleteCurriculumPackage(batch, identity).files;

  const approvedAt = new Date().toISOString();
  const canonicalIds = new Set(canonical.map((file) => file.id));
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

  // Publish immediately into atomic runtime state so the learner catalog updates
  // without waiting for deployment. The finalize route also exports the same
  // validated batch to Git, which is the durable canonical publication path.
  if (options.publish === false) return { attempted: true, approvedFiles: 50 };

  const published = options.uploadId && options.lease && (process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL)
    ? await publishNeonLessonsTransaction({uploadId:options.uploadId,lessons:await extractPublishedLessonsFromBatch(batch),lease:options.lease})
    : await upsertPublishedLessonsFromBatch(batch, { requireAtomic: options.requireAtomic });
  if (published.upserted !== 50) {
    throw new Error(`Trusted curriculum publication for ${identity.track}/${identity.level}/${identity.language} published ${published.upserted} of 50 lessons.`);
  }

  invalidateRegistryCache();
  await revalidatePublishedCurriculumRoutes(identity.track);
  return { attempted: true, approvedFiles: 50, publishedLessons: published.upserted };
}
