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
      retries: 0,
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
    { concurrency: 4, retries: 0, sizeOf: () => 1 },
  );

  assert.equal(successes.length, 47);
  assert.deepEqual(failures.map((failure) => failure.index), [2, 17, 45]);
  assert.ok(successes.includes(49), "last package must still complete");
});

test("retries a transient package transfer without duplicating the batch item", async () => {
  const attempts = new Map<number, number>();
  const completed: number[] = [];

  const failures = await runParallelUploads(
    [0, 1, 2, 3],
    async (item, index, report) => {
      const attempt = (attempts.get(index) ?? 0) + 1;
      attempts.set(index, attempt);
      report(5);
      if (item === 2 && attempt === 1) throw new Error("temporary storage connection failure");
      report(10);
      completed.push(item);
    },
    { concurrency: 4, retries: 2, sizeOf: () => 10 },
  );

  assert.deepEqual(failures, []);
  assert.equal(attempts.get(2), 2);
  assert.equal(completed.filter((item) => item === 2).length, 1);
  assert.deepEqual([...completed].sort((a, b) => a - b), [0, 1, 2, 3]);
});

test("failure reporter cannot terminate the remaining browser uploads", async () => {
  const attempted: number[] = [];

  const failures = await runParallelUploads(
    [0, 1, 2, 3, 4],
    async (item) => {
      attempted.push(item);
      if (item === 1) throw new Error("terminal transfer failure");
    },
    {
      concurrency: 2,
      retries: 0,
      sizeOf: () => 1,
      onFailure: () => {
        throw new Error("UI reporter failed");
      },
    },
  );

  assert.equal(failures.length, 1);
  assert.ok(attempted.includes(4), "later packages must still be attempted");
});
