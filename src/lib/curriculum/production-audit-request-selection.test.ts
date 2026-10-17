import assert from "node:assert/strict";
import { test } from "node:test";

import {
  MAX_PRODUCTION_AUDIT_COORDINATES,
  parseProductionAuditSelection,
} from "@/lib/curriculum/production-audit-request-selection";

const knownLocales = ["en-US", "fr-CA", "es-Caribbean", "es-419"];
function check(query: string) {
  return parseProductionAuditSelection(new URLSearchParams(query), knownLocales);
}

test("accepts one CLI coordinate without changing its value", () => {
  assert.deepEqual(check("tracks=RED&levels=1&locales=es-Caribbean"), {
    tracks: ["RED"], levels: [1], locales: ["es-Caribbean"],
  });
});

test("accepts exactly four independent coordinates", () => {
  assert.equal(MAX_PRODUCTION_AUDIT_COORDINATES, 4);
  assert.deepEqual(check("tracks=RED,WHITE&levels=1,2&locales=fr-CA"), {
    tracks: ["RED", "WHITE"], levels: [1, 2], locales: ["fr-CA"],
  });
});

test("rejects requests exceeding the four-coordinate budget", () => {
  assert.equal(check("tracks=RED,WHITE,BLUE&levels=1,2&locales=en-US"), null);
});

test("rejects default all-track or all-level scans from missing selections", () => {
  assert.equal(check("levels=1&locales=en-US"), null);
  assert.equal(check("tracks=RED&locales=en-US"), null);
  assert.equal(check("tracks=RED&levels=1"), null);
  assert.equal(check(""), null);
});

test("rejects unknown track rather than silently auditing zero tracks", () => {
  assert.equal(check("tracks=VIOLET&levels=1&locales=en-US"), null);
  assert.equal(check("tracks=RED,VIOLET&levels=1&locales=en-US"), null);
});

test("rejects invalid or lossy level coercions", () => {
  for (const level of ["0", "6", "1.5", "NaN", "01", "-1", "abc"]) {
    assert.equal(check(`tracks=RED&levels=${encodeURIComponent(level)}&locales=en-US`), null);
  }
  assert.equal(check("tracks=RED&levels=1,invalid&locales=en-US"), null);
});

test("rejects unknown, empty, or duplicate locale values", () => {
  assert.equal(check("tracks=RED&levels=1&locales=zz-ZZ"), null);
  assert.equal(check("tracks=RED&levels=1&locales="), null);
  assert.equal(check("tracks=RED&levels=1&locales=en-US,en-US"), null);
});

test("rejects duplicates that would waste Blob reads", () => {
  assert.equal(check("tracks=RED,RED&levels=1&locales=en-US"), null);
  assert.equal(check("tracks=RED&levels=1,1&locales=en-US"), null);
});

test("requires live catalog membership rather than guesswork from locale syntax", () => {
  assert.deepEqual(check("tracks=BLUE&levels=4&locales=es-419")?.locales, ["es-419"]);
  assert.equal(check("tracks=BLUE&levels=4&locales=es-ES"), null);
});
