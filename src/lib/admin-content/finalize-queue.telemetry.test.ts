import assert from "node:assert/strict";
import { test } from "node:test";

import { runSequentialFinalization } from "@/lib/admin-content/finalize-queue";

test("Q2: a throwing progress observer cannot strand 21 stored packages", async () => {
  const packages = Array.from({ length: 21 }, (_, index) => index + 1);
  const attempted: number[] = [];
  const failures: number[] = [];
  let progressCalls = 0;
  const published = await runSequentialFinalization(
    packages,
    async (id) => {
      attempted.push(id);
      if (id === 19) throw new Error("HTTP 422: defective stored ZIP");
      return id;
    },
    () => {
      progressCalls += 1;
      throw new Error("progress telemetry unavailable");
    },
    ({ item }) => failures.push(item),
  );

  assert.deepEqual(attempted, packages, "all 21 packages must reach finalization");
  assert.deepEqual(failures, [19], "the single defective package must remain identifiable");
  assert.equal(published.length, 20, "twenty valid packages must remain successful");
  assert.equal(published.includes(19), false);
  assert.equal(published.at(-1), 21, "later packages must not be stranded");
  assert.equal(progressCalls, 21);
});

test("Q2: an empty finalization queue survives broken progress telemetry", async () => {
  const published = await runSequentialFinalization(
    [],
    async () => "unused",
    () => { throw new Error("progress telemetry unavailable"); },
  );
  assert.deepEqual(published, []);
});
