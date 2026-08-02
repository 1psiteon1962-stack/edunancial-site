/**
 * Tests for the curriculum reader — multi-academy scaffold.
 *
 * Validates that:
 *   1. listTracks() always returns RED, WHITE, and BLUE regardless of registry contents.
 *   2. Every track always exposes exactly five levels (L1-L5).
 *   3. Empty levels have lessonCount=0 (rendered as "Coming Soon" by the UI).
 *   4. RED Level 1 reflects the ten production lessons already in the registry.
 *   5. getTrack() returns valid summaries for all canonical academies.
 *   6. getAllTrackLevelStaticParams() generates 15 params (3 academies × 5 levels).
 *   7. Existing lesson URLs remain unchanged (routing backwards-compatibility).
 *
 * These tests run against the real registry.json on disk, so they serve as
 * lightweight integration checks without requiring a build.
 * Run with: npm test
 */

import assert from "node:assert/strict";
import { describe, test, beforeEach } from "node:test";

import {
  getAllTrackLevelStaticParams,
  getAllLessonStaticParams,
  getTrack,
  invalidateRegistryCache,
  listTracks,
} from "@/lib/curriculum/reader";

// Ensure each describe block starts with a fresh cache.
beforeEach(() => {
  invalidateRegistryCache();
});

describe("listTracks — canonical academy scaffold", () => {
  test("always returns exactly three tracks: RED, WHITE, BLUE", () => {
    const tracks = listTracks();
    assert.equal(tracks.length, 3);
    const codes = tracks.map((t) => t.code);
    assert.ok(codes.includes("RED"), "RED must be present");
    assert.ok(codes.includes("WHITE"), "WHITE must be present");
    assert.ok(codes.includes("BLUE"), "BLUE must be present");
  });

  test("every track always has exactly five levels", () => {
    const tracks = listTracks();
    for (const track of tracks) {
      assert.equal(
        track.levels.length,
        5,
        `${track.code} must have 5 levels, got ${track.levels.length}`
      );
    }
  });

  test("level numbers are 1, 2, 3, 4, 5 in order for every track", () => {
    const tracks = listTracks();
    for (const track of tracks) {
      const levelNums = track.levels.map((l) => l.level);
      assert.deepEqual(levelNums, [1, 2, 3, 4, 5], `${track.code} level ordering is wrong`);
    }
  });

  test("RED Level 1 has production lessons (≥1)", () => {
    const tracks = listTracks();
    const red = tracks.find((t) => t.code === "RED");
    assert.ok(red, "RED track must exist");
    const l1 = red!.levels.find((l) => l.level === 1);
    assert.ok(l1, "RED Level 1 must exist");
    assert.ok(l1!.lessonCount >= 1, `RED Level 1 must have ≥1 lesson, got ${l1!.lessonCount}`);
  });

  test("RED Levels 2-5 are empty (Coming Soon) until published", () => {
    const tracks = listTracks();
    const red = tracks.find((t) => t.code === "RED");
    assert.ok(red, "RED track must exist");
    for (const level of red!.levels.filter((l) => l.level > 1)) {
      assert.equal(
        level.lessonCount,
        0,
        `RED Level ${level.level} should be empty (Coming Soon)`
      );
    }
  });

  test("WHITE has correct track name", () => {
    const tracks = listTracks();
    const white = tracks.find((t) => t.code === "WHITE");
    assert.ok(white, "WHITE track must exist");
    assert.equal(white!.name, "Paper Assets");
  });

  test("BLUE has correct track name", () => {
    const tracks = listTracks();
    const blue = tracks.find((t) => t.code === "BLUE");
    assert.ok(blue, "BLUE track must exist");
    assert.equal(blue!.name, "Business");
  });

  test("WHITE all five levels are empty until published", () => {
    const tracks = listTracks();
    const white = tracks.find((t) => t.code === "WHITE");
    assert.ok(white, "WHITE track must exist");
    for (const level of white!.levels) {
      assert.equal(level.lessonCount, 0, `WHITE Level ${level.level} should be empty`);
    }
  });

  test("BLUE all five levels are empty until published", () => {
    const tracks = listTracks();
    const blue = tracks.find((t) => t.code === "BLUE");
    assert.ok(blue, "BLUE track must exist");
    for (const level of blue!.levels) {
      assert.equal(level.lessonCount, 0, `BLUE Level ${level.level} should be empty`);
    }
  });
});

describe("getTrack — per-academy queries", () => {
  test("returns valid summary for RED", () => {
    const track = getTrack("RED");
    assert.ok(track !== null, "RED must not return null");
    assert.equal(track!.code, "RED");
    assert.equal(track!.name, "Real Estate");
    assert.equal(track!.levels.length, 5);
  });

  test("returns valid summary for WHITE (even with no registry entry)", () => {
    const track = getTrack("WHITE");
    assert.ok(track !== null, "WHITE must not return null");
    assert.equal(track!.code, "WHITE");
    assert.equal(track!.name, "Paper Assets");
    assert.equal(track!.levels.length, 5);
  });

  test("returns valid summary for BLUE (even with no registry entry)", () => {
    const track = getTrack("BLUE");
    assert.ok(track !== null, "BLUE must not return null");
    assert.equal(track!.code, "BLUE");
    assert.equal(track!.name, "Business");
    assert.equal(track!.levels.length, 5);
  });

  test("is case-insensitive — lowercase track codes resolve correctly", () => {
    assert.ok(getTrack("red") !== null, "getTrack('red') must resolve");
    assert.ok(getTrack("white") !== null, "getTrack('white') must resolve");
    assert.ok(getTrack("blue") !== null, "getTrack('blue') must resolve");
  });

  test("returns null for unknown track codes", () => {
    assert.equal(getTrack("PINK"), null);
    assert.equal(getTrack("PURPLE"), null);
    assert.equal(getTrack(""), null);
  });
});

describe("getAllTrackLevelStaticParams — routing scaffold", () => {
  test("returns exactly 15 params (3 academies × 5 levels)", () => {
    const params = getAllTrackLevelStaticParams();
    assert.equal(params.length, 15);
  });

  test("includes level params for RED", () => {
    const params = getAllTrackLevelStaticParams();
    const redParams = params.filter((p) => p.track === "red");
    assert.equal(redParams.length, 5);
    const levels = redParams.map((p) => p.level).sort();
    assert.deepEqual(levels, ["l1", "l2", "l3", "l4", "l5"]);
  });

  test("includes level params for WHITE", () => {
    const params = getAllTrackLevelStaticParams();
    const whiteParams = params.filter((p) => p.track === "white");
    assert.equal(whiteParams.length, 5);
  });

  test("includes level params for BLUE", () => {
    const params = getAllTrackLevelStaticParams();
    const blueParams = params.filter((p) => p.track === "blue");
    assert.equal(blueParams.length, 5);
  });

  test("all track values are lowercase", () => {
    const params = getAllTrackLevelStaticParams();
    for (const p of params) {
      assert.equal(p.track, p.track.toLowerCase(), `track param must be lowercase: ${p.track}`);
    }
  });

  test("all level values follow the l{n} pattern", () => {
    const params = getAllTrackLevelStaticParams();
    const levelPattern = /^l[1-5]$/;
    for (const p of params) {
      assert.match(p.level, levelPattern, `level param must match l{n}: ${p.level}`);
    }
  });
});

describe("getAllLessonStaticParams — backwards-compatible lesson routing", () => {
  test("existing RED Level 1 lesson params use lowercase track and level", () => {
    const params = getAllLessonStaticParams();
    for (const p of params) {
      assert.equal(p.track, p.track.toLowerCase(), "track must be lowercase");
      assert.equal(p.level, p.level.toLowerCase(), "level must be lowercase");
      assert.equal(p.lesson, p.lesson.toLowerCase(), "lesson must be lowercase");
    }
  });

  test("all RED Level 1 lessons are reachable via /curriculum/red/l1/{id}", () => {
    const params = getAllLessonStaticParams();
    const redL1 = params.filter((p) => p.track === "red" && p.level === "l1");
    // There are 10 production lessons in RED Level 1
    assert.ok(redL1.length >= 1, "must have at least one RED Level 1 lesson");
    for (const p of redL1) {
      assert.match(
        p.lesson,
        /^red-l1-\d{3}$/,
        `lesson param must match red-l1-NNN pattern: ${p.lesson}`
      );
    }
  });
});
