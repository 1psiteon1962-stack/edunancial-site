import assert from "node:assert/strict";
import { test } from "node:test";

import { getPublishedTracks } from "@/lib/curriculum/authoritative-published";

test("production always exposes active canonical registry lessons without a publication-state flag", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalFallback = process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;

    const tracks = await getPublishedTracks("en");
    const red = tracks.find((track) => track.code === "RED");
    assert.ok(red, "RED curriculum track must exist in production");

    const level2 = red.levels.find((level) => level.level === 2);
    assert.ok(level2, "RED Level 2 must exist in production");

    const lessonIds = new Set(level2.lessons.map((lesson) => lesson.id));
    assert.ok(lessonIds.has("RED-L2-001"), "RED-L2-001 must remain visible from the canonical registry");
    assert.ok(lessonIds.has("RED-L2-002"), "RED-L2-002 must remain visible from the canonical registry");
    assert.ok(level2.lessonCount >= 2, "RED Level 2 must report its committed lessons");
  } finally {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalFallback === undefined) {
      delete process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;
    } else {
      process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = originalFallback;
    }
  }
});
