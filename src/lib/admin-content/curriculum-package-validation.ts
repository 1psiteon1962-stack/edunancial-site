import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import type { UploadBatch } from "@/lib/admin-content/types";

export type ValidatedCurriculumPackage = {
  files: UploadBatch["files"];
  lessonNumbers: Set<number>;
};

function lessonNumber(file: UploadBatch["files"][number], identity: PackageIdentity): number | null {
  if (file.extension !== ".md") return null;
  const levelMatch = identity.level.match(/^level-([1-5])$/u);
  if (!levelMatch) return null;
  const prefix = `${identity.track.toUpperCase()}-L${levelMatch[1]}-`;
  const pattern = new RegExp(`^${prefix}(\\d{3})(?:[.-]|$)`, "u");
  const archivePattern = new RegExp(`(?:^|/)${prefix}(\\d{3})(?:[.-]|$)`, "u");
  const match = file.originalFilename.toUpperCase().match(pattern)
    ?? file.normalizedFilename.toUpperCase().match(pattern)
    ?? file.archivePath?.toUpperCase().match(archivePattern);
  if (!match) return null;
  const number = Number(match[1]);
  return number >= 1 && number <= 50 ? number : null;
}

/**
 * One validation standard for canonical and localized curriculum packages,
 * across every configured track, L1-L5, and locale.
 */
export function validateCompleteCurriculumPackage(
  batch: UploadBatch,
  identity: PackageIdentity,
): ValidatedCurriculumPackage {
  const numbered = batch.files.map((file) => ({ file, lessonNumber: lessonNumber(file, identity) }));
  const files = numbered.filter((entry) => entry.lessonNumber !== null).map((entry) => entry.file);
  const lessonNumbers = new Set(numbered.map((entry) => entry.lessonNumber).filter((value): value is number => value !== null));
  const unsafeFiles = batch.files.filter((file) =>
    file.processingStatus === "error" || file.conflictStatus !== "none" || file.duplicateStatus !== "new"
  );
  if (files.length !== 50 || lessonNumbers.size !== 50 || unsafeFiles.length > 0) {
    throw new Error(
      `Curriculum package ${identity.track}/${identity.level}/${identity.language} failed validation: lessons=${files.length}, uniqueLessons=${lessonNumbers.size}, unsafeFiles=${unsafeFiles.length}. Expected exactly 50 unique lessons with no conflicts, duplicates, or processing errors.`,
    );
  }
  for (let number = 1; number <= 50; number += 1) {
    if (!lessonNumbers.has(number)) throw new Error(`Curriculum package is missing lesson ${String(number).padStart(3, "0")}.`);
  }
  return { files, lessonNumbers };
}
