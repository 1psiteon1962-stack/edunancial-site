import assert from "node:assert/strict";
import test from "node:test";

import { computeProgressState } from "./progress";

test("progress completion is idempotent", () => {
  const state = computeProgressState({
    completedLessonIds: ["RED-L1-001", "RED-L1-001", "RED-L1-002"],
    totalLessons: 3,
    orderedLessonIds: ["RED-L1-001", "RED-L1-002", "RED-L1-003"],
    activeLessonId: "RED-L1-002",
  });

  assert.deepEqual(state.completedLessonIds, ["RED-L1-001", "RED-L1-002"]);
  assert.equal(state.completedCount, 2);
});

test("progress percentage calculated server-side and clamped", () => {
  const state = computeProgressState({
    completedLessonIds: ["RED-L1-001", "RED-L1-002", "RED-L1-003", "RED-L1-004"],
    totalLessons: 3,
    orderedLessonIds: ["RED-L1-001", "RED-L1-002", "RED-L1-003"],
    activeLessonId: "RED-L1-004",
  });

  assert.equal(state.progressPercent, 100);
  assert.equal(state.completed, true);
});
