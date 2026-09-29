import assert from "node:assert/strict";
import test from "node:test";

import { COURSE_TRACKS } from "@/lib/admin-content/constants";
import { ADMIN_CONTENT_LANGUAGES } from "@/lib/admin-content/languages";
import { COURSE_LEVELS } from "@/lib/admin-content/upload-intake";
import { listRestorationCoordinates, restorationCoordinateKey } from "@/lib/curriculum/restoration-matrix";

test("restoration matrix covers every configured track, level, and locale", () => {
  const coordinates = listRestorationCoordinates();
  assert.equal(coordinates.length, COURSE_TRACKS.length * COURSE_LEVELS.length * ADMIN_CONTENT_LANGUAGES.length);
  for (const level of COURSE_LEVELS) assert.ok(coordinates.some((entry) => entry.level === level));
  for (const locale of ADMIN_CONTENT_LANGUAGES) assert.ok(coordinates.some((entry) => entry.locale === locale));
  assert.equal(new Set(coordinates.map(restorationCoordinateKey)).size, coordinates.length);
});
