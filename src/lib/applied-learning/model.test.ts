import { describe, expect, it } from "vitest";

import {
  appliedLearningStage,
  shouldUseAppliedLearningExtension,
  validateScenarioTrackDepth,
  type AppliedLearningScenario,
} from "./model";

describe("applied learning chess model", () => {
  it("keeps Level 1 on the existing simple lesson path", () => {
    expect(shouldUseAppliedLearningExtension(1)).toBe(false);
    expect(shouldUseAppliedLearningExtension(2)).toBe(true);
  });

  it("uses the common five-level progression", () => {
    expect(appliedLearningStage(1)).toBe("understand");
    expect(appliedLearningStage(2)).toBe("apply");
    expect(appliedLearningStage(3)).toBe("analyze");
    expect(appliedLearningStage(4)).toBe("strategize");
    expect(appliedLearningStage(5)).toBe("integrate");
  });

  it("requires broader cross-track reasoning at advanced levels", () => {
    const levelFive: AppliedLearningScenario = {
      id: "capital-allocation-001",
      title: "Allocate owner capital",
      level: 5,
      primaryTrack: "GOLD",
      supportingTracks: ["BLUE", "RED", "WHITE", "GREEN", "PURPLE"],
      competencyTags: ["capital-allocation", "risk", "opportunity-cost"],
      prompt: "Choose and defend a capital allocation strategy.",
    };

    expect(validateScenarioTrackDepth(levelFive)).toEqual([]);
  });
});
