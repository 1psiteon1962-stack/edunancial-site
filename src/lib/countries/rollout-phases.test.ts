import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  GLOBAL_ROLLOUT_PHASES,
  getGlobalRolloutPhase,
  getRolloutPhaseForCountry,
  ROLLOUT_EXCLUDED_ISO_CODES,
  ROLLOUT_HELD_FOR_REVIEW_ISO_CODES,
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

describe("owner-approved rollout list (2026-11-17)", () => {
  test("Turkey is planned with the Middle East", () => {
    assert.equal(getRolloutPhaseForCountry("TR")?.id, "middle-east");
  });

  test("approved wave 4 and wave 5 markets are staged", () => {
    for (const iso of ["IE", "BE", "AT", "CH", "SE", "PL", "HU", "SG", "TW", "HK", "BN"]) {
      assert.equal(getRolloutPhaseForCountry(iso)?.ownerApprovedWave, 4, iso);
    }
    for (const iso of ["EE", "GR", "UA", "IN", "PK", "KZ"]) {
      assert.equal(getRolloutPhaseForCountry(iso)?.ownerApprovedWave, 5, iso);
    }
  });

  test("every phase is private planning", () => {
    for (const phase of GLOBAL_ROLLOUT_PHASES) assert.equal(phase.visibility, "private");
  });

  test("excluded and held markets are in no phase", () => {
    for (const iso of [...Object.keys(ROLLOUT_EXCLUDED_ISO_CODES), ...ROLLOUT_HELD_FOR_REVIEW_ISO_CODES]) {
      assert.equal(getRolloutPhaseForCountry(iso), undefined, iso);
    }
  });

  test("no country appears in two phases", () => {
    const all = GLOBAL_ROLLOUT_PHASES.flatMap((phase) => phase.targetIsoCodes);
    assert.equal(new Set(all).size, all.length);
  });
});
