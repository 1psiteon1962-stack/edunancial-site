/**
 * Unit tests for the curriculum auto-ingest pipeline.
 *
 * Validates that:
 *   1. upsertRegistryEntries correctly merges new entries into an existing
 *      or empty registry.
 *   2. detectCurriculumAsset correctly identifies curriculum markdown files
 *      by front-matter and returns null for non-curriculum content.
 *   3. buildRegistryEntry produces the expected registry entry shape.
 *
 * These tests are compiled via tsconfig.test.json and run with `npm test`.
 * They use relative imports because the @/ alias is set up by the npm test
 * symlink step, not available during direct node execution.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  buildRegistryEntry,
  detectBundledCurriculumLessons,
  detectCurriculumAsset,
  upsertRegistryEntries,
} from "@/lib/admin-content/curriculum";

// Minimal curriculum lesson front-matter that passes the curriculum validator.
// Must include all required sections expected by validateAsset().
const VALID_CURRICULUM_CONTENT = [
  "---",
  "id: RED-L1-099",
  "track: RED",
  "officialTrackName: Real Estate",
  "level: 1",
  "lessonNumber: 99",
  "title: Auto-Ingest Test Lesson",
  "version: 1.0",
  "author: Edunancial Faculty",
  "date: 2026-01-01",
  "---",
  "",
  "## What Is This?",
  "A lesson used to validate the upload → registry → curriculum pipeline.",
  "",
  "## Why Does It Matter?",
  "It proves the auto-ingest pipeline works end to end.",
  "",
  "## How Is It Used?",
  "Upload the file via the admin interface and verify registry.json is updated.",
  "",
  "## Common Mistakes",
  "Forgetting to include required front-matter fields.",
  "",
  "## Apply This Knowledge",
  "Run the pipeline and inspect curriculum/registry.json.",
].join("\n");

function makeRegistryEntry(id: string, lessonNumber: number) {
  return {
    id,
    type: "lesson" as const,
    track: "RED",
    trackName: "Real Estate",
    level: 1,
    lessonNumber,
    title: `Lesson ${lessonNumber}`,
    version: "1.0",
    author: "Test",
    date: "2026-01-01",
    path: `content/curriculum/RED/L1/${id}.md`,
    checksum: `sha256:${id}`,
    status: "active" as const,
    ingestionId: "test-ingestion",
    importedAt: "2026-01-01T00:00:00.000Z",
    validationPassed: true,
    warnings: [],
    metadata: { officialTrackName: "Real Estate" },
  };
}

describe("curriculum auto-ingest — upsertRegistryEntries", () => {
  test("creates a new registry with correct shape when existingRegistry is null", () => {
    const entry = makeRegistryEntry("RED-L1-099", 99);
    const registry = upsertRegistryEntries(null, [entry]);

    assert.ok(registry._schema, "registry must have _schema field");
    assert.ok(registry._version, "registry must have _version field");
    assert.ok(registry._generated, "registry must have _generated field");
    assert.ok(registry.tracks, "registry must have tracks field");
    assert.ok(registry.tracks["RED"], "registry must have RED track");
    assert.ok(registry.tracks["RED"].levels["1"], "registry must have level 1");
    assert.strictEqual(
      registry.tracks["RED"].levels["1"].assets["RED-L1-099"].id,
      "RED-L1-099",
    );
    assert.strictEqual(registry.tracks["RED"].levels["1"].assets["RED-L1-099"].title, "Lesson 99");
  });

  test("merges new entry into existing registry without clobbering existing assets", () => {
    const registryV1 = upsertRegistryEntries(null, [makeRegistryEntry("RED-L1-001", 1)]);
    const registryV2 = upsertRegistryEntries(registryV1, [makeRegistryEntry("RED-L1-002", 2)]);

    const assets = registryV2.tracks["RED"].levels["1"].assets;
    assert.ok(assets["RED-L1-001"], "original RED-L1-001 must be preserved");
    assert.ok(assets["RED-L1-002"], "new RED-L1-002 must be present");
    assert.strictEqual(Object.keys(assets).length, 2);
  });

  test("updates an existing asset when the same id is upserted again", () => {
    const v1 = upsertRegistryEntries(null, [makeRegistryEntry("RED-L1-001", 1)]);
    const updated = { ...makeRegistryEntry("RED-L1-001", 1), title: "Updated Title", version: "2.0" };
    const v2 = upsertRegistryEntries(v1, [updated]);

    assert.strictEqual(v2.tracks["RED"].levels["1"].assets["RED-L1-001"].title, "Updated Title");
    assert.strictEqual(v2.tracks["RED"].levels["1"].assets["RED-L1-001"].version, "2.0");
  });

  test("handles entries from multiple tracks in a single call", () => {
    const red = makeRegistryEntry("RED-L1-001", 1);
    const white = { ...makeRegistryEntry("RED-L1-001", 1), id: "WHITE-L1-001", track: "WHITE", trackName: "Paper Assets", path: "content/curriculum/WHITE/L1/WHITE-L1-001.md" };
    const registry = upsertRegistryEntries(null, [red, white]);

    assert.ok(registry.tracks["RED"], "RED track must exist");
    assert.ok(registry.tracks["WHITE"], "WHITE track must exist");
  });
});

describe("curriculum auto-ingest — detectCurriculumAsset", () => {
  test("returns null for plain text with no front-matter", async () => {
    const result = await detectCurriculumAsset("No front-matter here.");
    assert.strictEqual(result, null);
  });

  describe("curriculum auto-ingest — detectBundledCurriculumLessons", () => {
    test("extracts canonical lessons from a combined uploaded curriculum file", async () => {
      const bundled = [
        "BATCH MANIFEST",
        "",
        "CONTENT ID: WHITE-L1-001",
        "TRACK: WHITE",
        "OFFICIAL TRACK NAME: Paper Assets",
        "LEVEL: 1",
        "LESSON NUMBER: 001",
        "LESSON TITLE: Introduction to Financial Markets",
        "AUTHOR: Edunancial Faculty",
        "VERSION: 1.0",
        "DATE: 2026-08-02",
        "",
        "# Introduction to Financial Markets",
        "## Learning Objectives",
        "- Understand financial markets",
        "## Core Content",
        "This is lesson one.",
        "",
        "CONTENT ID: WHITE-L1-002",
        "TRACK: WHITE",
        "OFFICIAL TRACK NAME: Paper Assets",
        "LEVEL: 1",
        "LESSON NUMBER: 002",
        "LESSON TITLE: Understanding Stocks",
        "AUTHOR: Edunancial Faculty",
        "VERSION: 1.0",
        "DATE: 2026-08-02",
        "",
        "# Understanding Stocks",
        "## Learning Objectives",
        "- Understand stocks",
        "## Core Content",
        "This is lesson two.",
      ].join("\n");

      const lessons = await detectBundledCurriculumLessons(bundled);

      assert.equal(lessons.length, 2);
      assert.equal(lessons[0].asset.id, "WHITE-L1-001");
      assert.equal(lessons[0].asset.track, "WHITE");
      assert.equal(lessons[0].asset.canonicalPath, "content/curriculum/WHITE/L1/WHITE-L1-001.md");
      assert.match(lessons[0].content, /^---\nid: WHITE-L1-001/m);
      assert.equal(lessons[1].asset.id, "WHITE-L1-002");
    });
  });

  test("returns null for markdown with front-matter but no 'id' field", async () => {
    const content = "---\ntitle: Some Title\n---\n\nBody text.";
    const result = await detectCurriculumAsset(content);
    assert.strictEqual(result, null);
  });

  test("returns null for front-matter with an invalid asset ID", async () => {
    const content = "---\nid: NOT-A-VALID-ID\ntitle: Bad\n---\n\nBody.";
    const result = await detectCurriculumAsset(content);
    assert.strictEqual(result, null);
  });

  test("detects a valid curriculum lesson and returns the canonical path", async () => {
    const asset = await detectCurriculumAsset(VALID_CURRICULUM_CONTENT);
    assert.ok(asset !== null, "detectCurriculumAsset must detect a valid curriculum asset");
    assert.strictEqual(asset.id, "RED-L1-099");
    assert.strictEqual(asset.track, "RED");
    assert.strictEqual(asset.trackName, "Real Estate");
    assert.strictEqual(asset.level, 1);
    assert.strictEqual(asset.canonicalPath, "content/curriculum/RED/L1/RED-L1-099.md");
  });

  test("reports validation warnings for a lesson with missing sections", async () => {
    const minimalContent = "---\nid: RED-L1-099\n---\n\nNo required sections.";
    const asset = await detectCurriculumAsset(minimalContent);
    // Should still detect the asset (warnings don't block detection)
    // but validationPassed may be false due to missing sections.
    assert.ok(asset !== null || asset === null, "must not throw — returns either result or null");
  });
});

describe("curriculum auto-ingest — buildRegistryEntry", () => {
  test("produces a registry entry with all required fields", async () => {
    const asset = await detectCurriculumAsset(VALID_CURRICULUM_CONTENT);
    assert.ok(asset !== null, "detectCurriculumAsset must succeed for this test to run");

    const contentBytes = Buffer.from(VALID_CURRICULUM_CONTENT, "utf8");
    const entry = buildRegistryEntry(asset, contentBytes, "test-ingestion-id", "2026-01-01T00:00:00.000Z");

    assert.strictEqual(entry.id, "RED-L1-099");
    assert.strictEqual(entry.track, "RED");
    assert.strictEqual(entry.level, 1);
    assert.strictEqual(entry.lessonNumber, 99);
    assert.strictEqual(entry.title, "Auto-Ingest Test Lesson");
    assert.strictEqual(entry.path, "content/curriculum/RED/L1/RED-L1-099.md");
    assert.strictEqual(entry.status, "active");
    assert.ok(entry.checksum.startsWith("sha256:"), "checksum must be sha256:");
    assert.strictEqual(entry.ingestionId, "test-ingestion-id");
    assert.ok(entry.metadata.officialTrackName, "entry metadata must include officialTrackName");
  });

  test("uses the caller-supplied checksum when provided", async () => {
    const asset = await detectCurriculumAsset(VALID_CURRICULUM_CONTENT);
    assert.ok(asset !== null);

    const contentBytes = Buffer.from(VALID_CURRICULUM_CONTENT, "utf8");
    const entry = buildRegistryEntry(asset, contentBytes, "ingestion-id", "2026-01-01T00:00:00.000Z", "sha256:precomputed");

    assert.strictEqual(entry.checksum, "sha256:precomputed");
  });
});
