import test from "node:test";
import assert from "node:assert/strict";

import { evaluateCoachRequest, type CoachRequest } from "./guardrails";

const INVESTMENT_ADVICE_MESSAGE =
  "Edunancial does not recommend specific stocks, businesses, cryptocurrencies, real estate, or other investments. Explain your reasoning and evidence. If you need individualized advice, use the Marketplace to consult a licensed professional.";

const BEGINNER_MESSAGE =
  "Explain the concept in simple language, ask one question at a time, and verify understanding before continuing.";

const INTERMEDIATE_MESSAGE =
  "Challenge assumptions, discuss risk, liquidity, cash flow, ROI, and opportunity cost.";

const ADVANCED_MESSAGE =
  "Require evidence, multiple scenarios, quantitative reasoning, and discussion of competing viewpoints.";

const INVALID_COMPETENCY_MESSAGE =
  "I can help with general financial education. Please choose beginner, intermediate, or advanced.";

function buildRequest(overrides: Partial<CoachRequest> = {}): CoachRequest {
  return {
    competency: "beginner",
    topic: "budgeting",
    asksForSpecificInvestment: false,
    ...overrides,
  };
}

test("returns beginner guidance for beginner competency", () => {
  const response = evaluateCoachRequest(
    buildRequest({
      competency: "beginner",
      topic: "budgeting basics",
    }),
  );

  assert.deepEqual(response, {
    permitted: true,
    redirectToMarketplace: false,
    message: BEGINNER_MESSAGE,
  });
});

test("returns intermediate guidance for intermediate competency", () => {
  const response = evaluateCoachRequest(
    buildRequest({
      competency: "intermediate",
      topic: "cash flow planning",
    }),
  );

  assert.deepEqual(response, {
    permitted: true,
    redirectToMarketplace: false,
    message: INTERMEDIATE_MESSAGE,
  });
});

test("returns advanced guidance for advanced competency", () => {
  const response = evaluateCoachRequest(
    buildRequest({
      competency: "advanced",
      topic: "valuation scenarios",
    }),
  );

  assert.deepEqual(response, {
    permitted: true,
    redirectToMarketplace: false,
    message: ADVANCED_MESSAGE,
  });
});

test("blocks specific investment requests and redirects to marketplace", () => {
  const response = evaluateCoachRequest(
    buildRequest({
      competency: "intermediate",
      topic: "should I buy TSLA",
      asksForSpecificInvestment: true,
    }),
  );

  assert.deepEqual(response, {
    permitted: false,
    redirectToMarketplace: true,
    message: INVESTMENT_ADVICE_MESSAGE,
  });
});

test("uses investment guardrail even when competency is invalid", () => {
  const response = evaluateCoachRequest({
    competency: "expert" as CoachRequest["competency"],
    topic: "recommend me one crypto",
    asksForSpecificInvestment: true,
  });

  assert.deepEqual(response, {
    permitted: false,
    redirectToMarketplace: true,
    message: INVESTMENT_ADVICE_MESSAGE,
  });
});

test("returns safe response for invalid competency without redirect", () => {
  const response = evaluateCoachRequest({
    competency: "expert" as CoachRequest["competency"],
    topic: "scenario planning",
    asksForSpecificInvestment: false,
  });

  assert.deepEqual(response, {
    permitted: false,
    redirectToMarketplace: false,
    message: INVALID_COMPETENCY_MESSAGE,
  });
});

test("topic variations do not change competency-based messaging", () => {
  const plainTopic = evaluateCoachRequest(
    buildRequest({
      competency: "advanced",
      topic: "liquidity",
    }),
  );

  const mixedTopic = evaluateCoachRequest(
    buildRequest({
      competency: "advanced",
      topic: "  LIQUIDITY + 🇺🇸 taxes + 2026?!  ",
    }),
  );

  assert.equal(plainTopic.message, ADVANCED_MESSAGE);
  assert.equal(mixedTopic.message, ADVANCED_MESSAGE);
  assert.equal(plainTopic.redirectToMarketplace, false);
  assert.equal(mixedTopic.redirectToMarketplace, false);
});
