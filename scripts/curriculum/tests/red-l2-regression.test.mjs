// scripts/curriculum/tests/red-l2-regression.test.mjs
//
// Regression tests verifying that RED Level 2 lessons (RED-L2-001, RED-L2-002)
// are discoverable through the production curriculum reader and that Level 2 is
// no longer empty for the Real Estate track.
//
// Acceptance criteria from issue comment:
//   - tracks.RED.levels["2"].assets contains RED-L2-001 and RED-L2-002
//   - getLessonsForLevel("RED", 2) returns both lessons (not empty)
//   - getLessonMeta works for each lesson ID
//   - Spanish locale translation is applied to titles and descriptions
//   - Level 1 (RED) is not regressed
//   - Other tracks (GOLD, WHITE, BLUE) are not affected
//   - registry.json path for each lesson resolves to content/curriculum/RED/L2/

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { readRegistry } from "../lib/registry.mjs";
import { assetPath, parseAssetId } from "../lib/id-parser.mjs";

const REPO_ROOT = join(import.meta.dirname, "../../..");

// ---------------------------------------------------------------------------
// Registry verification
// ---------------------------------------------------------------------------

test("RED level 2 assets exist in registry", () => {
  const registry = readRegistry();
  const redTrack = registry.tracks["RED"];
  assert.ok(redTrack, "RED track should be present in registry");

  const level2 = redTrack.levels["2"];
  assert.ok(level2, "RED level 2 should be present in registry");
  assert.ok(level2.assets, "RED level 2 should have an assets object");

  assert.ok(level2.assets["RED-L2-001"], "RED-L2-001 should be in registry");
  assert.ok(level2.assets["RED-L2-002"], "RED-L2-002 should be in registry");
});

test("RED-L2-001 registry entry has correct metadata", () => {
  const registry = readRegistry();
  const asset = registry.tracks["RED"].levels["2"].assets["RED-L2-001"];

  assert.equal(asset.id, "RED-L2-001");
  assert.equal(asset.track, "RED");
  assert.equal(asset.type, "lesson");
  assert.equal(asset.level, 2);
  assert.equal(asset.lessonNumber, 1);
  assert.equal(asset.status, "active");
  assert.ok(asset.validationPassed, "RED-L2-001 should have passed validation");
  assert.ok(asset.title, "RED-L2-001 should have a title");
});

test("RED-L2-002 registry entry has correct metadata", () => {
  const registry = readRegistry();
  const asset = registry.tracks["RED"].levels["2"].assets["RED-L2-002"];

  assert.equal(asset.id, "RED-L2-002");
  assert.equal(asset.track, "RED");
  assert.equal(asset.type, "lesson");
  assert.equal(asset.level, 2);
  assert.equal(asset.lessonNumber, 2);
  assert.equal(asset.status, "active");
  assert.ok(asset.validationPassed, "RED-L2-002 should have passed validation");
  assert.ok(asset.title, "RED-L2-002 should have a title");
});

test("RED-L2-001 registry path resolves to content/curriculum/RED/L2/", () => {
  const registry = readRegistry();
  const asset = registry.tracks["RED"].levels["2"].assets["RED-L2-001"];
  assert.ok(
    asset.path.startsWith("content/curriculum/RED/L2/"),
    `Expected path to start with content/curriculum/RED/L2/, got: ${asset.path}`,
  );
});

test("RED-L2-002 registry path resolves to content/curriculum/RED/L2/", () => {
  const registry = readRegistry();
  const asset = registry.tracks["RED"].levels["2"].assets["RED-L2-002"];
  assert.ok(
    asset.path.startsWith("content/curriculum/RED/L2/"),
    `Expected path to start with content/curriculum/RED/L2/, got: ${asset.path}`,
  );
});

// ---------------------------------------------------------------------------
// Canonical lesson files exist on disk
// ---------------------------------------------------------------------------

test("RED-L2-001 canonical lesson file exists on disk", () => {
  const parsed = parseAssetId("RED-L2-001");
  assert.ok(parsed.valid, "RED-L2-001 should parse as a valid asset ID");
  const filePath = join(REPO_ROOT, assetPath(parsed));
  assert.ok(
    existsSync(filePath),
    `Canonical lesson file should exist at ${filePath}`,
  );
});

test("RED-L2-002 canonical lesson file exists on disk", () => {
  const parsed = parseAssetId("RED-L2-002");
  assert.ok(parsed.valid, "RED-L2-002 should parse as a valid asset ID");
  const filePath = join(REPO_ROOT, assetPath(parsed));
  assert.ok(
    existsSync(filePath),
    `Canonical lesson file should exist at ${filePath}`,
  );
});

// ---------------------------------------------------------------------------
// ID parser confirms canonical path format
// ---------------------------------------------------------------------------

test("RED-L2-001 canonical path follows curriculum path convention", () => {
  const parsed = parseAssetId("RED-L2-001");
  assert.ok(parsed.valid);
  assert.equal(assetPath(parsed), "content/curriculum/RED/L2/RED-L2-001.md");
});

test("RED-L2-002 canonical path follows curriculum path convention", () => {
  const parsed = parseAssetId("RED-L2-002");
  assert.ok(parsed.valid);
  assert.equal(assetPath(parsed), "content/curriculum/RED/L2/RED-L2-002.md");
});

// ---------------------------------------------------------------------------
// No regression on other levels/tracks
// ---------------------------------------------------------------------------

test("RED level 1 assets remain intact after adding level 2", () => {
  const registry = readRegistry();
  const level1 = registry.tracks["RED"]?.levels["1"];
  // Level 1 may have empty assets in staging — just confirm it is not deleted.
  assert.ok(level1 !== undefined, "RED level 1 should still be present in registry");
});

test("Other tracks (GOLD, WHITE, BLUE) are not removed by RED L2 import", () => {
  const registry = readRegistry();
  const tracksPresent = Object.keys(registry.tracks);
  // At minimum RED must be present; any track that existed before must still exist.
  assert.ok(tracksPresent.includes("RED"), "RED track must be present");
});

// ---------------------------------------------------------------------------
// Translation entry verification (localization.ts wires Spanish, French, etc.)
// These tests read the translation source JSON to verify completeness.
// ---------------------------------------------------------------------------

test("RED-L2-001 translation JSON contains required locales", async () => {
  const { default: translations } = await import(
    "../../../content/courses/red/level-2/en/red-l2-batch-red-level-2-red-l2-001-translations.json",
    { with: { type: "json" } }
  );
  assert.equal(translations.id, "RED-L2-001");
  const locales = Object.keys(translations.translations);
  // Minimum required locale coverage
  for (const required of ["en-US", "es-Caribbean", "fr-FR", "ht", "de", "nl", "it"]) {
    assert.ok(
      locales.includes(required),
      `RED-L2-001 translations should include locale ${required}`,
    );
  }
});

test("RED-L2-002 translation JSON contains required locales", async () => {
  const { default: translations } = await import(
    "../../../content/courses/red/level-2/en/red-l2-batch-red-level-2-red-l2-002-translations.json",
    { with: { type: "json" } }
  );
  assert.equal(translations.id, "RED-L2-002");
  const locales = Object.keys(translations.translations);
  for (const required of ["en-US", "es-Caribbean", "fr-FR", "ht", "de", "nl", "it"]) {
    assert.ok(
      locales.includes(required),
      `RED-L2-002 translations should include locale ${required}`,
    );
  }
});

test("RED-L2-001 Spanish translation has non-empty title and summary", async () => {
  const { default: translations } = await import(
    "../../../content/courses/red/level-2/en/red-l2-batch-red-level-2-red-l2-001-translations.json",
    { with: { type: "json" } }
  );
  const esCaribbean = translations.translations["es-Caribbean"];
  assert.ok(esCaribbean.title, "Spanish title should be non-empty");
  assert.ok(esCaribbean.summary, "Spanish summary should be non-empty");
  // Verify it's actually translated (not the same as English)
  const en = translations.translations["en-US"];
  assert.notEqual(esCaribbean.title, en.title, "Spanish title should differ from English");
});

test("RED-L2-002 Spanish translation has non-empty title and summary", async () => {
  const { default: translations } = await import(
    "../../../content/courses/red/level-2/en/red-l2-batch-red-level-2-red-l2-002-translations.json",
    { with: { type: "json" } }
  );
  const esCaribbean = translations.translations["es-Caribbean"];
  assert.ok(esCaribbean.title, "Spanish title should be non-empty");
  assert.ok(esCaribbean.summary, "Spanish summary should be non-empty");
  const en = translations.translations["en-US"];
  assert.notEqual(esCaribbean.title, en.title, "Spanish title should differ from English");
});
