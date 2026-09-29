import { COURSE_TRACKS } from "@/lib/admin-content/constants";
import { ADMIN_CONTENT_LANGUAGES } from "@/lib/admin-content/languages";
import { COURSE_LEVELS } from "@/lib/admin-content/upload-intake";

export type RestorationCoordinate = {
  track: (typeof COURSE_TRACKS)[number];
  level: (typeof COURSE_LEVELS)[number];
  locale: (typeof ADMIN_CONTENT_LANGUAGES)[number];
};

/**
 * The restoration space is derived from shared platform configuration.
 * Adding a supported locale to the central admin language registry makes it
 * part of this matrix automatically; no level- or locale-specific restoration
 * code is permitted.
 */
export function listRestorationCoordinates(): RestorationCoordinate[] {
  return COURSE_TRACKS.flatMap((track) =>
    COURSE_LEVELS.flatMap((level) =>
      ADMIN_CONTENT_LANGUAGES.map((locale) => ({ track, level, locale })),
    ),
  );
}

export function restorationCoordinateKey(coordinate: RestorationCoordinate) {
  return `${coordinate.track.toUpperCase()}:L${coordinate.level.replace("level-", "")}:${coordinate.locale}`;
}
