import assert from "node:assert/strict";
import test from "node:test";
import { normalizeReplayBatchSize, requireKpiReplayAuthorization } from "./replay-guardrails";

test("replay is disabled by default", () => {
  assert.throws(() => requireKpiReplayAuthorization({}), /disabled/);
});
test("replay requires migration confirmation", () => {
  assert.throws(() => requireKpiReplayAuthorization({ KPI_SPOOL_REPLAY_ENABLED: "true" }), /migration/);
});
test("replay accepts explicit enablement and migration confirmation", () => {
  assert.doesNotThrow(() => requireKpiReplayAuthorization({
    KPI_SPOOL_REPLAY_ENABLED: "true",
    KPI_REPLAY_MIGRATION_APPLIED: "true",
  }));
});
test("batch sizes are finite and capped", () => {
  assert.equal(normalizeReplayBatchSize(undefined), 25);
  assert.equal(normalizeReplayBatchSize("999"), 100);
  assert.equal(normalizeReplayBatchSize("0"), 25);
  assert.equal(normalizeReplayBatchSize("not-a-number"), 25);
});
