import { describe, expect, it } from "vitest";

import { getJurisdictionInheritanceChain } from "./jurisdiction-policy";
import {
  buildLessonBoundedLocalizationInstruction,
  normalizeLearningJurisdiction,
} from "./localization";

describe("jurisdiction-aware localization", () => {
  it("keeps language independent from learning jurisdiction", () => {
    const prompt = buildLessonBoundedLocalizationInstruction({
      scope: {
        lessonId: "RED-L1-003",
        displayLanguage: "de-DE",
        learningJurisdiction: "CH",
        sourceJurisdiction: "US",
        adaptationType: "jurisdiction-adaptation",
      },
      lessonTitle: "What Is Equity in a Home?",
      canonicalLesson: "Equity is the difference between value and debt.",
    });

    expect(prompt).toContain("Display language: de-DE");
    expect(prompt).toContain("Switzerland (CH)");
    expect(prompt).toContain("Never infer jurisdiction from language");
  });

  it("models Puerto Rico as inheriting from the United States", () => {
    expect(getJurisdictionInheritanceChain("PR")).toEqual(["PR", "US", "UNIVERSAL"]);
  });

  it("normalizes common jurisdiction names", () => {
    expect(normalizeLearningJurisdiction("Puerto Rico")).toBe("PR");
    expect(normalizeLearningJurisdiction("USA")).toBe("US");
  });
});
