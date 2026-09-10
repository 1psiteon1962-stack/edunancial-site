import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { publishBatch } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, UploadBatch } from "@/lib/admin-content/types";

const TRUSTED_TRACKS = new Set(["red", "white", "blue", "green", "gold", "purple", "orange", "black"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);
const TRUSTED_LEVELS = new Set(["level-2", "level-3"]);

export function isTrustedCanonicalCurriculumIdentity(identity: PackageIdentity | null): boolean {
  return Boolean(identity && TRUSTED_TRACKS.has(identity.track) && TRUSTED_LEVELS.has(identity.level) && CANONICAL_ENGLISH.has(identity.language));
}

function lessonNumberForPackage(file: UploadBatch["files"][number], identity: PackageIdentity): number | null {
  if (file.extension !== ".md") return null;
  const track = identity.track.toUpperCase();
  const level = identity.level === "level-2" ? "L2" : "L3";
  const pattern = new RegExp(`^${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const archivePattern = new RegExp(`(?:^|/)${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const match = file.originalFilename.toUpperCase().match(pattern) ?? file.normalizedFilename.toUpperCase().match(pattern) ?? file.archivePath?.toUpperCase().match(archivePattern);
  if (!match) return null;
  const lessonNumber = Number(match[1]);
  return lessonNumber >= 1 && lessonNumber <= 50 ? lessonNumber : null;
}

export async function autoPublishTrustedCanonicalCurriculumBatch(batch: UploadBatch, identity: PackageIdentity | null, actor: ActorContext): Promise<{ attempted: boolean; approvedFiles: number; pullRequestUrl?: string }> {
  if (!isTrustedCanonicalCurriculumIdentity(identity) || !identity) return { attempted: false, approvedFiles: 0 };
  if (batch.exports.some((entry) => entry.github?.pullRequestUrl)) {
    const existing = batch.exports.find((entry) => entry.github?.pullRequestUrl)?.github?.pullRequestUrl;
    return { attempted: false, approvedFiles: batch.files.filter((file) => file.reviewStatus === "approved").length, pullRequestUrl: existing };
  }

  const numbered = batch.files.map((file) => ({ file, lessonNumber: lessonNumberForPackage(file, identity) }));
  const canonical = numbered.filter((entry) => entry.lessonNumber !== null);
  const approvedFiles = canonical.length;
  const lessonNumbers = new Set(canonical.map((entry) => entry.lessonNumber as number));
  const unsafeFiles = batch.files.filter((file) => file.processingStatus === "error" || file.conflictStatus !== "none" || file.duplicateStatus !== "new");
  if (approvedFiles !== 50 || lessonNumbers.size !== 50 || unsafeFiles.length > 0) {
    throw new Error(`Trusted curriculum package must contain exactly 50 canonical lesson files with unique lessons 001-050 and no conflicts, duplicates, or processing errors. Found canonical=${approvedFiles}, uniqueLessons=${lessonNumbers.size}, unsafeFiles=${unsafeFiles.length}.`);
  }
  for (let lesson = 1; lesson <= 50; lesson += 1) if (!lessonNumbers.has(lesson)) throw new Error(`Trusted curriculum package is missing lesson ${String(lesson).padStart(3, "0")}.`);

  const approvedAt = new Date().toISOString();
  const canonicalIds = new Set(canonical.map((entry) => entry.file.id));
  batch.files = batch.files.map((file) => canonicalIds.has(file.id) ? { ...file, reviewStatus: "approved" as const, approvedAt, rejectedAt: null, updatedAt: approvedAt } : file);
  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  const result = await publishBatch(batch.id, actor);
  if (!result.github?.pullRequestUrl) throw new Error(`Trusted curriculum publication for ${identity.track}/${identity.level}/${identity.language} did not create a GitHub pull request.`);
  return { attempted: true, approvedFiles: 50, pullRequestUrl: result.github.pullRequestUrl };
}
