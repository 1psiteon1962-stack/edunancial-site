import test from "node:test";
import assert from "node:assert/strict";

import {
  appliedLearningStage,
  shouldUseAppliedLearningExtension,
  validateScenarioTrackDepth,
  type AppliedLearningScenario,
} from "./model";

test("keeps Level 1 on the existing simple lesson path", () => {
  assert.equal(shouldUseAppliedLearningExtension(1), false);
  assert.equal(shouldUseAppliedLearningExtension(2), true);
});

test("uses the common five-level progression", () => {
  assert.equal(appliedLearningStage(1), "understand");
  assert.equal(appliedLearningStage(2), "apply");
  assert.equal(appliedLearningStage(3), "analyze");
  assert.equal(appliedLearningStage(4), "strategize");
  assert.equal(appliedLearningStage(5), "integrate");
});

test("requires broader cross-track reasoning at advanced levels", () => {
  const levelFive: AppliedLearningScenario = {
    id: "capital-allocation-001",
    title: "Allocate owner capital",
    level: 5,
    primaryTrack: "GOLD",
    supportingTracks: ["BLUE", "RED", "WHITE", "GREEN", "PURPLE"],
    competencyTags: ["capital-allocation", "risk", "opportunity-cost"],
    prompt: "Choose and defend a capital allocation strategy.",
  };

  assert.deepEqual(validateScenarioTrackDepth(levelFive), []);
});
