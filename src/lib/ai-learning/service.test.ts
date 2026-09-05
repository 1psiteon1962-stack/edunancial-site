import test from "node:test";
import assert from "node:assert/strict";

import { generateAILearningResponse } from "./service";
import { DEFAULT_AI_LEARNING_CONFIG } from "./config";
import type { AILearningContext } from "./context";

function buildContext(overrides: Partial<AILearningContext> = {}): AILearningContext {
  return {
    pathname: "/curriculum/blue/l3/blue-l3-004",
    track: "BLUE",
    level: 3,
    lessonId: "BLUE-L3-004",
    topic: "Entity selection",
    // Contexts reaching the service have already passed through pipeline locale canonicalization.
    language: "en-us",
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

async function expectAvailabilityGatePasses(context: AILearningContext) {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await generateAILearningResponse({ message: "Help me understand this lesson", context });
    assert.equal(response.enabled, false);
    assert.match(response.message, /not yet configured/i);
    assert.doesNotMatch(response.message, /lesson, jurisdiction, or language configuration/i);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
}

test("returns not-configured response when OPENAI_API_KEY is absent", async () => {
  await expectAvailabilityGatePasses(buildContext());
});

test("normalized regional locale passes configuration gating", async () => {
  await expectAvailabilityGatePasses(buildContext({
    pathname: "/curriculum/red/l1/red-l1-001",
    track: "RED",
    level: 1,
    lessonId: "RED-L1-001",
    language: "en-us",
  }));
});

test("one AI Coach availability contract covers every color and level", async () => {
  const tracks = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
  for (const track of tracks) {
    for (let level = 1; level <= 5; level += 1) {
      const lessonId = `${track}-L${level}-001`;
      await expectAvailabilityGatePasses(buildContext({
        pathname: `/curriculum/${track.toLowerCase()}/l${level}/${lessonId.toLowerCase()}`,
        track,
        level,
        lessonId,
      }));
    }
  }
});

test("every configured locale inherits the same AI Coach availability contract", async () => {
  for (const language of DEFAULT_AI_LEARNING_CONFIG.supportedLanguages) {
    await expectAvailabilityGatePasses(buildContext({ language }));
  }
});

test("new eligible lessons inherit AI availability without an allow-list change", async () => {
  await expectAvailabilityGatePasses(buildContext({
    pathname: "/curriculum/black/l5/black-l5-999",
    track: "BLACK",
    level: 5,
    lessonId: "BLACK-L5-999",
    topic: "Future published lesson",
  }));
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
    config: { publicAssistanceEnabled: false },
  });
  assert.equal(response.enabled, false);
  assert.match(response.message, /reserved for members/i);
});

test("language-aware gating disables unsupported locale without calling AI", async () => {
  const response = await generateAILearningResponse({
    message: "Help me",
    context: buildContext({ language: "ru" }),
    config: { supportedLanguages: ["en-US"] },
  });
  assert.equal(response.enabled, false);
  assert.match(response.message, /currently unavailable/i);
});
