import test from "node:test";
import assert from "node:assert/strict";

import {
  canUseAILearningLesson,
  canUseAILearningTrack,
  DEFAULT_AI_LEARNING_CONFIG,
  mergeAILearningConfig,
} from "./config";

test("mergeAILearningConfig applies defaults and normalization", () => {
  const merged = mergeAILearningConfig({
    enabledGlobally: false,
    enabledTracks: ["blue"],
    disabledLessons: ["blue-l1-001"],
    supportedJurisdictions: ["us", "ca"],
    supportedLanguages: ["en-US", "es"],
    publicAssistanceEnabled: false,
  });

  assert.equal(merged.enabledGlobally, false);
  assert.deepEqual(merged.enabledTracks, ["BLUE"]);
  assert.deepEqual(merged.disabledLessons, ["BLUE-L1-001"]);
  assert.deepEqual(merged.supportedJurisdictions, ["US", "CA"]);
  assert.equal(merged.publicAssistanceEnabled, false);
});

test("track and lesson checks respect config lists", () => {
  const config = mergeAILearningConfig({
    enabledTracks: ["RED", "BLUE"],
    disabledLessons: ["RED-L1-002"],
  });

  assert.equal(canUseAILearningTrack("BLUE", config), true);
  assert.equal(canUseAILearningTrack("WHITE", config), false);
  assert.equal(canUseAILearningLesson("RED-L1-002", config), false);
  assert.equal(canUseAILearningLesson("RED-L1-003", config), true);
});

test("default config enables initial rollout tracks and public assistance", () => {
  assert.equal(DEFAULT_AI_LEARNING_CONFIG.enabledGlobally, true);
  assert.ok(DEFAULT_AI_LEARNING_CONFIG.enabledTracks.includes("RED"));
  assert.equal(DEFAULT_AI_LEARNING_CONFIG.publicAssistanceEnabled, true);
});
