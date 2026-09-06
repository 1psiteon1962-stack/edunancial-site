import { extractZipEntries, validateFileType } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { toAcademyLevel, type UploadConfig } from "@/lib/admin-content/upload-intake";
import { resolvePackageUploadConfig } from "@/lib/admin-content/package-upload-config";
import type { StoredUploadEntry } from "@/lib/admin-content/service";

function key(filename: string, pillar: string, level: string | null, language: string) {
  return [filename.trim().toLowerCase(), pillar, level ?? "", language].join("::");
}

/**
 * Returns true only when every curriculum lesson contained in an incoming
 * package already exists in a previously PUBLISHED batch for the same
 * track/level/language. Draft, pending, rejected, or failed uploads do not
 * count, so an interrupted upload can be retried safely.
 */
export async function isCurriculumPackageAlreadyPublished(
  upload: StoredUploadEntry,
  baseConfig: UploadConfig,
): Promise<boolean> {
  if (baseConfig.destination !== "courses") return false;

  const config = resolvePackageUploadConfig(baseConfig, upload.originalFilename);
  if (config.destination !== "courses") return false;

  const storage = getAdminContentStorage();
  const buffer = await storage.readBinary(upload.storagePath);
  if (!buffer) return false;

  const { extension } = validateFileType(upload.originalFilename, upload.mimeType, buffer);
  const incomingNames = extension === ".zip"
    ? extractZipEntries(buffer).map((entry) => entry.normalizedName)
    : [upload.originalFilename];
  if (!incomingNames.length) return false;

  const summaries = await storage.listBatches();
  const published = new Set<string>();
  for (const summary of summaries) {
    const batch = await storage.getBatch(summary.id);
    if (!batch) continue;
    for (const file of batch.files) {
      if (file.metadata.publicationStatus !== "published") continue;
      published.add(key(
        file.normalizedFilename,
        String(file.metadata.pillar ?? file.classification.pillar ?? ""),
        file.metadata.academyLevel ?? file.classification.academyLevel ?? null,
        String(file.metadata.language ?? file.classification.language ?? ""),
      ));
    }
  }

  const level = toAcademyLevel(config.level);
  return incomingNames.every((filename) =>
    published.has(key(filename, config.track, level, config.language)),
  );
}
