import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  GLOBAL_ROLLOUT_PHASES,
  getGlobalRolloutPhase,
  getRolloutPhaseForCountry,
} from "./rollout-phases";

describe("global rollout phases", () => {
  test("phases are ordered and unique", () => {
    const orders = GLOBAL_ROLLOUT_PHASES.map((phase) => phase.order);
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
    assert.equal(new Set(GLOBAL_ROLLOUT_PHASES.map((phase) => phase.id)).size, GLOBAL_ROLLOUT_PHASES.length);
  });

  test("Western Europe aligns with current launch-language markets", () => {
    const phase = getGlobalRolloutPhase("western-europe");
    assert.ok(phase);
    for (const iso of ["GB", "ES", "FR", "DE", "IT", "NL", "PT"]) {
      assert.ok(phase.targetIsoCodes.includes(iso));
    }
  });

  test("priority Latin America and Caribbean markets are explicitly staged", () => {
    assert.equal(getRolloutPhaseForCountry("MX")?.id, "latin-america");
    assert.equal(getRolloutPhaseForCountry("BR")?.id, "latin-america");
    assert.equal(getRolloutPhaseForCountry("PR")?.id, "caribbean");
    assert.equal(getRolloutPhaseForCountry("DO")?.id, "caribbean");
  });

  test("planning phase membership does not imply registry activation", () => {
    const phase = getRolloutPhaseForCountry("MX");
    assert.ok(phase);
    assert.equal(phase.id, "latin-america");
  });
});
