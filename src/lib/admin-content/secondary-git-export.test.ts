import assert from "node:assert/strict";
import test from "node:test";
import { enqueueExportWithoutInvalidatingPublication } from "./secondary-git-export";

test("successful secondary export queue returns true", async () => {
  let called = false;
  const accepted = await enqueueExportWithoutInvalidatingPublication(async () => { called = true; }, () => {
    assert.fail("success must not report a queue error");
  });
  assert.equal(accepted, true);
  assert.equal(called, true);
});

test("queue rejection does not throw or invalidate published finalization", async () => {
  const failure = new Error("temporary Git export queue outage");
  let reported: unknown;
  const accepted = await enqueueExportWithoutInvalidatingPublication(
    async () => { throw failure; },
    (error) => { reported = error; },
  );
  assert.equal(accepted, false);
  assert.equal(reported, failure);
});

test("synchronous queue failure is also contained", async () => {
  let logged = false;
  const accepted = await enqueueExportWithoutInvalidatingPublication(
    () => { throw new Error("queue unavailable"); },
    () => { logged = true; },
  );
  assert.equal(accepted, false);
  assert.equal(logged, true);
});
