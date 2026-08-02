/**
 * Tests for the academy consistency validator.
 *
 * Critical cases covered (all as pure unit tests — no Next.js dependencies):
 *   1. filename implies BLUE + assignment WHITE  => blocked
 *   2. curriculum front-matter track BLUE + assignment WHITE => blocked
 *   3. consistent assignments pass through cleanly
 *   4. non-color pillars are never blocked
 *
 * Service-level integration (updateBatchFile / bulkReview) is validated via
 * the checks embedded in service.ts; those paths are exercised by the
 * existing service.test.ts test suite.
 *
 * These tests are compiled via tsconfig.test.json and run with `npm test`.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  academyImpliedByFilename,
  academyImpliedByFrontMatter,
  validateAcademyConsistency,
} from "@/lib/admin-content/academy-consistency";

// ---------------------------------------------------------------------------
// Unit tests for the pure helper functions
// ---------------------------------------------------------------------------

describe("academyImpliedByFilename", () => {
  test("detects 'blue' in blue-level-1-combined.md", () => {
    assert.strictEqual(academyImpliedByFilename("blue-level-1-combined.md"), "blue");
  });

  test("detects 'white' in white-level-2-lesson.md", () => {
    assert.strictEqual(academyImpliedByFilename("white-level-2-lesson.md"), "white");
  });

  test("detects 'red' in red-l1-001.md", () => {
    assert.strictEqual(academyImpliedByFilename("red-l1-001.md"), "red");
  });

  test("returns null for a filename with no color token", () => {
    assert.strictEqual(academyImpliedByFilename("business-foundations.md"), null);
  });

  test("does not false-positive on 'already-covered.md' for red", () => {
    // 'red' must be a whole-word token; embedded inside another word is fine
    assert.strictEqual(academyImpliedByFilename("already-covered.md"), null);
  });
});

describe("academyImpliedByFrontMatter", () => {
  test("returns 'blue' when track: BLUE is in front-matter", () => {
    const raw = "---\nid: BLUE-L1-001\ntrack: BLUE\n---\n\nbody";
    assert.strictEqual(academyImpliedByFrontMatter(raw), "blue");
  });

  test("returns 'white' when track: WHITE is in front-matter", () => {
    const raw = "---\ntrack: WHITE\ntitle: Paper Assets Lesson\n---\n\nbody";
    assert.strictEqual(academyImpliedByFrontMatter(raw), "white");
  });

  test("returns 'red' when track: RED is in front-matter", () => {
    const raw = "---\ntrack: RED\ntitle: Real Estate Lesson\n---\n\nbody";
    assert.strictEqual(academyImpliedByFrontMatter(raw), "red");
  });

  test("returns null when there is no front-matter", () => {
    assert.strictEqual(academyImpliedByFrontMatter("Just a plain file."), null);
  });

  test("returns null when front-matter has no track field", () => {
    const raw = "---\ntitle: No Track\n---\n\nbody";
    assert.strictEqual(academyImpliedByFrontMatter(raw), null);
  });

  test("returns null for null/undefined input", () => {
    assert.strictEqual(academyImpliedByFrontMatter(null), null);
    assert.strictEqual(academyImpliedByFrontMatter(undefined), null);
  });
});

describe("validateAcademyConsistency", () => {
  // -------------------------------------------------------------------------
  // Blocked cases
  // -------------------------------------------------------------------------

  test("filename implies BLUE + assignment WHITE => blocked (exact bad case from problem statement)", () => {
    const result = validateAcademyConsistency("blue-level-1-combined.md", "white");
    assert.strictEqual(result.consistent, false);
    if (!result.consistent) {
      assert.match(result.error, /BLUE/);
      assert.match(result.error, /WHITE/);
    }
  });

  test("filename implies WHITE + assignment BLUE => blocked", () => {
    const result = validateAcademyConsistency("white-level-2-lesson.md", "blue");
    assert.strictEqual(result.consistent, false);
    if (!result.consistent) {
      assert.match(result.error, /WHITE/);
      assert.match(result.error, /BLUE/);
    }
  });

  test("curriculum front-matter track BLUE + assignment WHITE => blocked", () => {
    const raw = "---\nid: BLUE-L1-001\ntrack: BLUE\n---\n\nbody";
    const result = validateAcademyConsistency("lesson.md", "white", raw);
    assert.strictEqual(result.consistent, false);
    if (!result.consistent) {
      assert.match(result.error, /BLUE/);
      assert.match(result.error, /WHITE/);
    }
  });

  test("front-matter track WHITE + assignment RED => blocked", () => {
    const raw = "---\ntrack: WHITE\ntitle: Paper Assets\n---\n\nbody";
    const result = validateAcademyConsistency("paper-assets-lesson.md", "red", raw);
    assert.strictEqual(result.consistent, false);
    if (!result.consistent) {
      assert.match(result.error, /WHITE/);
      assert.match(result.error, /RED/);
    }
  });

  // -------------------------------------------------------------------------
  // Allowed cases
  // -------------------------------------------------------------------------

  test("filename implies BLUE + assignment BLUE => allowed", () => {
    const result = validateAcademyConsistency("blue-level-1-combined.md", "blue");
    assert.strictEqual(result.consistent, true);
  });

  test("filename with no color token + any pillar => allowed", () => {
    const result = validateAcademyConsistency("business-foundations.md", "white");
    assert.strictEqual(result.consistent, true);
  });

  test("front-matter track RED + assignment RED => allowed", () => {
    const raw = "---\ntrack: RED\ntitle: Real Estate\n---\n\nbody";
    const result = validateAcademyConsistency("red-lesson.md", "red", raw);
    assert.strictEqual(result.consistent, true);
  });

  test("non-color pillar ('academy' | 'uncategorized') is never blocked", () => {
    const result = validateAcademyConsistency("blue-level-1-combined.md", "uncategorized");
    // uncategorized has no track constraint so it should pass
    assert.strictEqual(result.consistent, true);
  });
});
