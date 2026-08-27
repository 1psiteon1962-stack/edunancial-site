import assert from "node:assert/strict";
import test from "node:test";

import { normalizeAILearningContext } from "./pipeline";

test("AI pipeline normalizes and bounds untrusted context fields", () => {
  const normalized = normalizeAILearningContext({
    pathname: "/curriculum/red/l1/red-l1-001\u0000",
    track: "red",
    level: 1.9,
    lessonId: "red-l1-001",
    topic: "  rental cash flow  ",
    language: "EN-us",
    membership: "premium",
    jurisdiction: "United States",
    country: "USA",
    progressPercent: 150,
    completedLessons: ["RED-L1-001", "RED-L1-001", "bad lesson id"],
    certificationPath: " RED-L1 ",
    sessionStreakDays: -2,
    lastContextUpdateAt: "2026-08-16T00:00:00.000Z",
  });
  assert.equal(normalized.pathname, "/curriculum/red/l1/red-l1-001");
  assert.equal(normalized.track, "RED");
  assert.equal(normalized.level, 1);
  assert.equal(normalized.lessonId, "RED-L1-001");
  assert.equal(normalized.topic, "rental cash flow");
  assert.equal(normalized.language, "en-us");
  assert.equal(normalized.jurisdiction, "US");
  assert.equal(normalized.country, "US");
  assert.equal(normalized.progressPercent, 100);
  assert.deepEqual(normalized.completedLessons, ["RED-L1-001"]);
  assert.equal(normalized.certificationPath, "RED-L1");
  assert.equal(normalized.sessionStreakDays, 0);
});

test("AI pipeline rejects unknown track and membership values", () => {
  const normalized = normalizeAILearningContext({
    pathname: "/", track: "UNKNOWN", level: 999, lessonId: "not valid!", topic: null,
    language: "not a locale", membership: "vip" as never, jurisdiction: "", country: "",
    progressPercent: -10, completedLessons: [], certificationPath: null, sessionStreakDays: 0, lastContextUpdateAt: "",
  });
  assert.equal(normalized.track, null);
  assert.equal(normalized.level, null);
  assert.equal(normalized.lessonId, null);
  assert.equal(normalized.language, "en");
  assert.equal(normalized.membership, "public");
  assert.equal(normalized.progressPercent, 0);
});
