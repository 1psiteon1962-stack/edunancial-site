import test from "node:test";
import assert from "node:assert/strict";

import { generateAILearningResponse } from "./service";
import type { AILearningContext } from "./context";

function buildContext(overrides: Partial<AILearningContext> = {}): AILearningContext {
  return {
    pathname: "/curriculum/blue/l3/blue-l3-004",
    track: "BLUE",
    level: 3,
    lessonId: "BLUE-L3-004",
    topic: "Entity selection",
    language: "en-US",
    membership: "premium",
    jurisdiction: "US",
    country: "US",
    progressPercent: 62,
    completedLessons: ["BLUE-L1-001", "BLUE-L1-002"],
    certificationPath: "BLUE-L3",
    sessionStreakDays: 4,
    lastContextUpdateAt: new Date().toISOString(),
    ...overrides,
  };
}

test("responds with context-aware coaching and milestone reinforcement", () => {
  const response = generateAILearningResponse({
    message: "Explain this lesson and give me a scenario",
    context: buildContext(),
  });

  assert.equal(response.enabled, true);
  assert.match(response.message, /Curriculum focus:/);
  assert.match(response.message, /You have completed 2 lessons/);
  assert.equal(response.disclaimers.length, 0);
});

test("blocks specific investment advice and includes educational guardrail", () => {
  const response = generateAILearningResponse({
    message: "Which stock should I buy right now?",
    context: buildContext({ progressPercent: 10 }),
  });

  assert.equal(response.enabled, true);
  assert.match(response.message, /does not recommend specific stocks/i);
  assert.ok(response.disclaimers.length >= 1);
});

test("supports jurisdiction comparison without dropping curriculum context", () => {
  const response = generateAILearningResponse({
    message: "What would this be in Canada compared with the United States?",
    context: buildContext(),
  });

  assert.equal(response.enabled, true);
  assert.match(response.message, /Canada|United States/);
  assert.match(response.contextSummary, /BLUE track/);
});

test("membership-aware response can disable public assistance", () => {
  const response = generateAILearningResponse({
    message: "Help me with this lesson",
    context: buildContext({ membership: "public" }),
    config: {
      publicAssistanceEnabled: false,
    },
  });

  assert.equal(response.enabled, false);
  assert.match(response.message, /reserved for members/i);
});

test("language-aware gating disables unsupported locale", () => {
  const response = generateAILearningResponse({
    message: "Help me",
    context: buildContext({ language: "ru" }),
    config: {
      supportedLanguages: ["en-US"],
    },
  });

  assert.equal(response.enabled, false);
  assert.match(response.message, /currently unavailable/i);
});
