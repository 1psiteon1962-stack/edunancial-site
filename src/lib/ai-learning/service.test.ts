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

test("returns not-configured response when OPENAI_API_KEY is absent", async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const response = await generateAILearningResponse({
      message: "Explain this lesson and give me a scenario",
      context: buildContext(),
    });

    assert.equal(response.enabled, false);
    assert.match(response.message, /not yet configured|temporarily unavailable/i);
    assert.equal(typeof response.contextSummary, "string");
    assert.ok(response.contextSummary.length > 0);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});

test("normalized regional locale passes configuration gating", async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const response = await generateAILearningResponse({
      message: "Any other property rights?",
      context: buildContext({
        pathname: "/curriculum/red/l1/red-l1-001",
        track: "RED",
        level: 1,
        lessonId: "RED-L1-001",
        language: "en-us",
      }),
    });

    // The normalized locale must pass the availability gate. With no key in
    // this test environment, the next expected response is the configuration
    // message rather than the lesson/jurisdiction/language unavailable message.
    assert.equal(response.enabled, false);
    assert.match(response.message, /not yet configured/i);
    assert.doesNotMatch(response.message, /lesson, jurisdiction, or language configuration/i);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});

test("blocks specific investment advice with guardrail before calling AI", async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const response = await generateAILearningResponse({
      message: "Which stock should I buy right now?",
      context: buildContext({ progressPercent: 10 }),
    });

    assert.equal(response.enabled, true);
    assert.match(response.message, /does not recommend specific stocks/i);
    assert.ok(response.disclaimers.length >= 1);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});

test("context summary includes track and jurisdiction regardless of AI availability", async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const response = await generateAILearningResponse({
      message: "What would this be in Canada compared with the United States?",
      context: buildContext(),
    });

    assert.match(response.contextSummary, /BLUE track/);
    assert.match(response.contextSummary, /Jurisdiction US/);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});

test("membership-aware response disables public assistance when configured", async () => {
  const response = await generateAILearningResponse({
    message: "Help me with this lesson",
    context: buildContext({ membership: "public" }),
    config: {
      publicAssistanceEnabled: false,
    },
  });

  assert.equal(response.enabled, false);
  assert.match(response.message, /reserved for members/i);
});

test("language-aware gating disables unsupported locale without calling AI", async () => {
  const response = await generateAILearningResponse({
    message: "Help me",
    context: buildContext({ language: "ru" }),
    config: {
      supportedLanguages: ["en-US"],
    },
  });

  assert.equal(response.enabled, false);
  assert.match(response.message, /currently unavailable/i);
});
