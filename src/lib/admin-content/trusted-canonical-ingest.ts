import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { deriveBatchStatus } from "@/lib/admin-content/review";
import { publishBatch } from "@/lib/admin-content/service";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import type { ActorContext, UploadBatch } from "@/lib/admin-content/types";

const TRUSTED_TRACKS = new Set(["red", "white", "blue", "green", "gold", "purple", "orange", "black"]);
const CANONICAL_ENGLISH = new Set(["en", "en-US"]);
const TRUSTED_LEVELS = new Set(["level-2", "level-3"]);

export function isTrustedCanonicalCurriculumIdentity(identity: PackageIdentity | null): boolean {
  return Boolean(identity
    && TRUSTED_TRACKS.has(identity.track)
    && TRUSTED_LEVELS.has(identity.level)
    && CANONICAL_ENGLISH.has(identity.language));
}

function lessonMatchesPackage(file: UploadBatch["files"][number], identity: PackageIdentity): boolean {
  if (file.extension !== ".md") return false;
  const track = identity.track.toUpperCase();
  const level = identity.level === "level-2" ? "L2" : "L3";
  const pattern = new RegExp(`^${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const archivePattern = new RegExp(`(?:^|/)${track}-${level}-(\\d{3})(?:[.-]|$)`, "u");
  const match = file.originalFilename.toUpperCase().match(pattern)
    ?? file.normalizedFilename.toUpperCase().match(pattern)
    ?? file.archivePath?.toUpperCase().match(archivePattern);
  if (!match) return false;
  const lessonNumber = Number(match[1]);
  return lessonNumber >= 1 && lessonNumber <= 50;
}

export async function autoPublishTrustedCanonicalCurriculumBatch(
  batch: UploadBatch,
  identity: PackageIdentity | null,
  actor: ActorContext,
): Promise<{
  attempted: boolean;
  approvedFiles: number;
  pullRequestUrl?: string;
}> {
  if (!isTrustedCanonicalCurriculumIdentity(identity) || !identity) {
    return { attempted: false, approvedFiles: 0 };
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
      updatedAt: approvedAt,
    };
  });

  if (approvedFiles !== 50) {
    throw new Error(`Trusted curriculum package ${identity.track}/${identity.level}/${identity.language} must contain exactly 50 canonical lesson files; found ${approvedFiles}.`);
  }

  batch.status = deriveBatchStatus(batch.files);
  batch.updatedAt = approvedAt;
  await getAdminContentStorage().updateBatch(batch);

  const result = await publishBatch(batch.id, actor);
  if (!result.github?.pullRequestUrl) {
    throw new Error(`Trusted curriculum publication for ${identity.track}/${identity.level}/${identity.language} did not create a GitHub pull request.`);
  }

  return {
    attempted: true,
    approvedFiles,
    pullRequestUrl: result.github.pullRequestUrl,
  };
}
