import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  getCountryLaunchAssessment,
  getCountryReadinessProfile,
  getGlobalRolloutSnapshot,
} from "./country-readiness-registry";

describe("country readiness registry", () => {
  test("unlisted countries fail closed", () => {
    const profile = getCountryReadinessProfile("UG");
    assert.deepEqual(profile.readiness, {
      translations: false,
      legal: false,
      payments: false,
      tax: false,
      privacy: false,
      content: false,
      support: false,
    });
  });

  test("United States is explicitly certified launch and commercial ready", () => {
    const assessment = getCountryLaunchAssessment("US");
    assert.ok(assessment);
    assert.equal(assessment.launchReady, true);
    assert.equal(assessment.commercialReady, true);
    assert.deepEqual(assessment.missing, []);
  });

  test("Canada remains blocked until launch readiness is certified", () => {
    const assessment = getCountryLaunchAssessment("CA");
    assert.ok(assessment);
    assert.equal(assessment.launchReady, false);
    assert.equal(assessment.commercialReady, false);
    assert.ok(assessment.missing.includes("translations"));
    assert.ok(assessment.missing.includes("legal"));
    assert.ok(assessment.missing.includes("tax"));
    assert.ok(assessment.missing.includes("support"));
  });

  test("global rollout snapshot contains every registered country", () => {
    const snapshot = getGlobalRolloutSnapshot();
    assert.ok(snapshot.length > 0);
    assert.ok(snapshot.some((country) => country.isoCode === "US"));
    assert.ok(snapshot.some((country) => country.isoCode === "UG"));
  });

  test("planning countries cannot be launch ready merely because features are enabled", () => {
    const uganda = getGlobalRolloutSnapshot().find((country) => country.isoCode === "UG");
    assert.ok(uganda);
    assert.equal(uganda.launchReady, false);
    assert.equal(uganda.commercialReady, false);
  });
});
