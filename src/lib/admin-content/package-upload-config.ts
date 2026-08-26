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

/**
 * Classify one curriculum file/package independently.
 *
 * Color and level must always be present in that file's own filename so a
 * mixed batch can never inherit another package's curriculum identity.
 * Language is slightly different: canonical lesson filenames such as
 * RED-L1-001.md do not include a locale. For those files the owner-selected
 * batch language is an explicit fallback. A locale embedded in the filename
 * always wins, which preserves safe mixed-language uploads.
 */
export function inferCurriculumPackageIdentity(
  filename: string,
  fallbackLanguage?: UploadLanguage | null,
): PackageIdentity {
  const track = inferCourseTrackFromFilename(filename);
  const level = inferCourseLevelFromFilename(filename);
  const language = (inferUploadLanguageFromFilename(filename) as UploadLanguage | null) ?? fallbackLanguage ?? null;
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
 * curriculum packages are classified independently. Only language may use the
 * owner's explicit batch fallback when a canonical filename has no locale.
 */
export function resolvePackageUploadConfig(baseConfig: UploadConfig, filename: string): UploadConfig {
  if (baseConfig.destination !== "courses") return baseConfig;

  const identity = inferCurriculumPackageIdentity(filename, baseConfig.language);
  return {
    ...baseConfig,
    track: identity.track,
    level: identity.level,
    language: identity.language,
    title: identity.title,
  };
}
