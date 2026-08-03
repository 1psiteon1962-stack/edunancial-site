import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAILearningContext,
  mergeContextAcrossNavigation,
  normalizeJurisdiction,
  parseCurriculumPath,
} from "./context";

test("parseCurriculumPath extracts track, level, and lesson", () => {
  const parsed = parseCurriculumPath("/curriculum/blue/l3/blue-l3-004");

  assert.equal(parsed.track, "BLUE");
  assert.equal(parsed.level, 3);
  assert.equal(parsed.lessonId, "BLUE-L3-004");
});

test("buildAILearningContext includes curriculum and user context", () => {
  const context = buildAILearningContext({
    pathname: "/curriculum/red/l2/red-l2-003",
    language: "fr-CA",
    membership: "premium",
    country: "Canada",
  });

  assert.equal(context.track, "RED");
  assert.equal(context.level, 2);
  assert.equal(context.lessonId, "RED-L2-003");
  assert.equal(context.language, "fr-CA");
  assert.equal(context.membership, "premium");
  assert.equal(context.country, "CA");
  assert.equal(context.jurisdiction, "CA");
  assert.equal(context.certificationPath, "RED-L2");
});

test("mergeContextAcrossNavigation persists lesson context across non-curriculum pages", () => {
  const previous = buildAILearningContext({
    pathname: "/curriculum/white/l1/white-l1-002",
    language: "en-US",
    membership: "basic",
    country: "US",
  });

  const current = buildAILearningContext({
    pathname: "/faq",
    language: "en-US",
    membership: "basic",
    country: "US",
  });

  const merged = mergeContextAcrossNavigation(previous, current);

  assert.equal(merged.track, "WHITE");
  assert.equal(merged.level, 1);
  assert.equal(merged.lessonId, "WHITE-L1-002");
});

test("normalizeJurisdiction maps known country labels and defaults", () => {
  assert.equal(normalizeJurisdiction("United States"), "US");
  assert.equal(normalizeJurisdiction("Canada"), "CA");
  assert.equal(normalizeJurisdiction(""), "US");
});
