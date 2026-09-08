import assert from "node:assert/strict";
import test from "node:test";

import { runParallelUploads } from "./parallel-upload";

test("continues a 100-package upload when package 46 fails", async () => {
  const items = Array.from({ length: 100 }, (_, index) => ({ index, size: 10 }));
  const attempted: number[] = [];
  const failed: number[] = [];

  const failures = await runParallelUploads(
    items,
    async (item, index, report) => {
      attempted.push(index);
      report(5);
      if (index === 45) throw new Error("bad package 46");
      report(10);
    },
    {
      concurrency: 4,
      sizeOf: (item) => item.size,
      onFailure: ({ index }) => failed.push(index),
    },
  );

  assert.equal(attempted.length, 100);
  assert.ok(attempted.includes(99), "package 100 must still be attempted");
  assert.deepEqual(failed, [45]);
  assert.equal(failures.length, 1);
  assert.equal(failures[0].index, 45);
});

test("isolates multiple upload failures without rejecting the batch", async () => {
  const items = Array.from({ length: 50 }, (_, index) => index);
  const terminalFailures = new Set([2, 17, 45]);
  const successes: number[] = [];

  const failures = await runParallelUploads(
    items,
    async (item, _index, report) => {
      report(1);
      if (terminalFailures.has(item)) throw new Error(`bad ${item}`);
      successes.push(item);
    },
    { concurrency: 4, sizeOf: () => 1 },
  );

  assert.equal(successes.length, 47);
  assert.deepEqual(failures.map((failure) => failure.index), [2, 17, 45]);
  assert.ok(successes.includes(49), "last package must still complete");
});
