import test from "node:test";
import assert from "node:assert/strict";

import { getJurisdictionInheritanceChain } from "./jurisdiction-policy";
import {
  buildLessonBoundedLocalizationInstruction,
  normalizeLearningJurisdiction,
} from "./localization";

test("keeps language independent from learning jurisdiction", () => {
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

  assert.match(prompt, /Display language: de-DE/);
  assert.match(prompt, /Switzerland \(CH\)/);
  assert.match(prompt, /Never infer jurisdiction from language/);
});

test("models Puerto Rico as inheriting from the United States", () => {
  assert.deepEqual(getJurisdictionInheritanceChain("PR"), ["PR", "US", "UNIVERSAL"]);
});

test("normalizes common jurisdiction names", () => {
  assert.equal(normalizeLearningJurisdiction("Puerto Rico"), "PR");
  assert.equal(normalizeLearningJurisdiction("USA"), "US");
});
