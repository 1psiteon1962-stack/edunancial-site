import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  inferCurriculumPackageIdentity,
  resolvePackageUploadConfig,
} from "@/lib/admin-content/package-upload-config";
import type { CourseUploadConfig } from "@/lib/admin-content/upload-intake";

const baseConfig: CourseUploadConfig = {
  destination: "courses",
  track: "red",
  level: "level-1",
  language: "en",
  membershipAccess: "basic",
  publicationStatus: "draft",
  title: "Bulk curriculum upload",
  description: "Bulk curriculum package",
};

describe("per-package curriculum identity", () => {
  test("keeps two packages of the same color independent by level and language", () => {
    const first = resolvePackageUploadConfig(baseConfig, "PURPLE-level-1-Business-Law-en-US.zip") as CourseUploadConfig;
    const second = resolvePackageUploadConfig(baseConfig, "PURPLE-level-2-Contracts-fr-CA.zip") as CourseUploadConfig;

    assert.deepEqual(
      { track: first.track, level: first.level, language: first.language, title: first.title },
      { track: "purple", level: "level-1", language: "en-US", title: "Business Law" },
    );
    assert.deepEqual(
      { track: second.track, level: second.level, language: second.language, title: second.title },
      { track: "purple", level: "level-2", language: "fr-CA", title: "Contracts" },
    );
  });

  test("keeps mixed-color packages independent in one batch", () => {
    const filenames = [
      "RED-level-1-Real-Estate-en-US.zip",
      "GREEN-level-2-Tax-Strategy-fr-CA.zip",
      "BLACK-level-5-Executive-Management-es-Caribbean.zip",
    ];

    const identities = filenames.map((filename) => inferCurriculumPackageIdentity(filename));
    assert.deepEqual(
      identities.map(({ track, level, language, title }) => ({ track, level, language, title })),
      [
        { track: "red", level: "level-1", language: "en-US", title: "Real Estate" },
        { track: "green", level: "level-2", language: "fr-CA", title: "Tax Strategy" },
        { track: "black", level: "level-5", language: "es-Caribbean", title: "Executive Management" },
      ],
    );
  });

  test("uses the explicit default language for canonical curriculum filenames", () => {
    const resolved = resolvePackageUploadConfig(baseConfig, "RED-L1-001.md") as CourseUploadConfig;
    assert.deepEqual(
      { track: resolved.track, level: resolved.level, language: resolved.language },
      { track: "red", level: "level-1", language: "en" },
    );
  });

  test("blocks an ambiguous curriculum package instead of inheriting another package identity", () => {
    assert.throws(
      () => resolvePackageUploadConfig(baseConfig, "lesson-bundle.zip"),
      /Cannot safely classify curriculum package lesson-bundle\.zip: missing color track, level/,
    );
  });
});
