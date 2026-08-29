import assert from "node:assert/strict";
import test from "node:test";

import { getRegionalActivationReadiness } from "./activation-readiness";

test("North America bootstrap runtime remains eligible when approved pricing exists", async () => {
  const readiness = await getRegionalActivationReadiness("US");
  assert.equal(readiness.regionCode, "north-america");
  assert.equal(readiness.pricingReady, true);
  assert.equal(readiness.independentRuntimeReady, true);
  assert.equal(readiness.ok, true);
});

test("future Central America activation fails closed without pricing and runtime", async () => {
  const readiness = await getRegionalActivationReadiness("CR");
  assert.equal(readiness.regionCode, "latin-america");
  assert.equal(readiness.deploymentKey, "latin-america-central-america");
  assert.equal(readiness.pricingReady, false);
  assert.equal(readiness.independentRuntimeReady, false);
  assert.equal(readiness.ok, false);
});

test("future South America uses a separate failure domain from Central America", async () => {
  const central = await getRegionalActivationReadiness("CR");
  const south = await getRegionalActivationReadiness("CO");
  assert.equal(central.deploymentKey, "latin-america-central-america");
  assert.equal(south.deploymentKey, "latin-america-south-america");
  assert.notEqual(central.deploymentKey, south.deploymentKey);
});

test("Caribbean has its own independent deployment key", async () => {
  const readiness = await getRegionalActivationReadiness("DO");
  assert.equal(readiness.regionCode, "caribbean");
  assert.equal(readiness.deploymentKey, "caribbean-caribbean");
  assert.equal(readiness.ok, false);
});
