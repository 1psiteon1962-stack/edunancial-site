import {
  inferCourseLevelFromFilename,
  inferCourseTrackFromFilename,
  inferCurriculumTitleFromFilename,
  inferUploadLanguageFromFilename,
  type CourseUploadConfig,
  type UploadConfig,
  type UploadLanguage,
} from "@/lib/admin-content/upload-intake";

export type PackageIdentity = {
  track: CourseUploadConfig["track"];
  level: CourseUploadConfig["level"];
  language: UploadLanguage;
  title: string;
};

export function inferCurriculumPackageIdentity(filename: string): PackageIdentity {
  const track = inferCourseTrackFromFilename(filename);
  const level = inferCourseLevelFromFilename(filename);
  const language = inferUploadLanguageFromFilename(filename) as UploadLanguage | null;
  const inferredTitle = inferCurriculumTitleFromFilename(filename);

  if (!track || !level || !language) {
    const missing = [
      !track ? "color track" : null,
      !level ? "level" : null,
      !language ? "language" : null,
    ].filter((value): value is string => Boolean(value));

    throw new Error(
      `Cannot safely classify curriculum package ${filename}: missing ${missing.join(", ")}.`,
    );
  }

  return {
    track,
    level,
    language,
    title: inferredTitle ?? `${track.toUpperCase()} ${level.replace("level-", "Level ")}`,
  };
}

/**
 * Resolve the configuration that must be used while constructing review files
 * for one uploaded package. Marketplace uploads remain batch-configured, while
 * curriculum packages are classified independently from their own filenames.
 */
export function resolvePackageUploadConfig(baseConfig: UploadConfig, filename: string): UploadConfig {
  if (baseConfig.destination !== "courses") return baseConfig;

  const identity = inferCurriculumPackageIdentity(filename);
  return {
    ...baseConfig,
    track: identity.track,
    level: identity.level,
    language: identity.language,
    title: identity.title,
  };
}
