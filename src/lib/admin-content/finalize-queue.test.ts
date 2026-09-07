import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { runParallelFinalization, runSequentialFinalization } from "@/lib/admin-content/finalize-queue";

describe("runParallelFinalization", () => {
  test("uses bounded concurrency instead of serial finalization", async () => {
    let active = 0;
    let maxActive = 0;
    const results = await runParallelFinalization(
      Array.from({ length: 12 }, (_, index) => index + 1),
      async (item) => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await new Promise((resolve) => setTimeout(resolve, 3));
        active -= 1;
        return item * 10;
      },
      undefined,
      undefined,
      { concurrency: 4 },
    );
    assert.equal(maxActive, 4);
    assert.deepEqual(results, Array.from({ length: 12 }, (_, index) => (index + 1) * 10));
  });

  test("21-package regression: package 18 fails and the other 20 complete", async () => {
    const attempted = new Set<number>();
    const failures: number[] = [];
    const items = Array.from({ length: 21 }, (_, index) => index + 1);
    const results = await runParallelFinalization(
      items,
      async (item) => {
        attempted.add(item);
        if (item === 18) throw new Error("HTTP 422: intentionally defective package");
        return item;
      },
      undefined,
      ({ item }) => failures.push(item),
      { concurrency: 4 },
    );
    assert.equal(attempted.size, 21);
    assert.ok(attempted.has(21), "packages after the failure must still run");
    assert.deepEqual(failures, [18]);
    assert.equal(results.length, 20);
    assert.ok(!results.includes(18));
    assert.ok(results.includes(21));
  });

  test("100-package regression continues after a late failure", async () => {
    const attempted = new Set<number>();
    const results = await runParallelFinalization(
      Array.from({ length: 100 }, (_, index) => index + 1),
      async (item) => {
        attempted.add(item);
        if (item === 46) throw new Error("HTTP 422: bad package");
        return item;
      },
      undefined,
      undefined,
      { concurrency: 6 },
    );
    assert.equal(attempted.size, 100);
    assert.ok(attempted.has(100));
    assert.equal(results.length, 99);
  });

  test("50-package regression isolates multiple failures", async () => {
    const failed = new Set([2, 17, 45]);
    const reported: number[] = [];
    const results = await runParallelFinalization(
      Array.from({ length: 50 }, (_, index) => index + 1),
      async (item) => {
        if (failed.has(item)) throw new Error("HTTP 422: bad package");
        return item;
      },
      undefined,
      ({ item }) => reported.push(item),
      { concurrency: 4 },
    );
    assert.deepEqual(reported.sort((a, b) => a - b), [2, 17, 45]);
    assert.equal(results.length, 47);
    assert.ok(results.includes(50));
  });

  test("a throwing failure reporter cannot kill the queue", async () => {
    const attempted: number[] = [];
    const results = await runParallelFinalization(
      [1, 2, 3, 4, 5],
      async (item) => {
        attempted.push(item);
        if (item === 2) throw new Error("HTTP 422: bad package");
        return item;
      },
      undefined,
      () => {
        throw new Error("telemetry unavailable");
      },
      { concurrency: 2 },
    );
    assert.equal(new Set(attempted).size, 5);
    assert.deepEqual(results, [1, 3, 4, 5]);
  });

  test("does not retry ambiguous gateway timeouts while other packages continue", async () => {
    let attemptsForTwo = 0;
    const failures: number[] = [];
    const visited: number[] = [];
    const results = await runParallelFinalization(
      [1, 2, 3, 4],
      async (item) => {
        visited.push(item);
        if (item === 2) {
          attemptsForTwo += 1;
          throw new Error("HTTP 504");
        }
        return item;
      },
      undefined,
      ({ item }) => failures.push(item),
      { concurrency: 2 },
    );
    assert.deepEqual(results, [1, 3, 4]);
    assert.equal(attemptsForTwo, 1, "504 must not trigger a duplicate finalization request");
    assert.deepEqual(failures, [2]);
    assert.ok(visited.includes(4), "other stored packages must continue after the ambiguous timeout");
  });

  test("still retries explicit transient server responses", async () => {
    let attemptsForTwo = 0;
    const results = await runParallelFinalization(
      [1, 2, 3],
      async (item) => {
        if (item === 2 && attemptsForTwo++ === 0) throw new Error("HTTP 503");
        return item;
      },
      undefined,
      undefined,
      { concurrency: 2 },
    );
    assert.deepEqual(results, [1, 2, 3]);
    assert.equal(attemptsForTwo, 2);
  });

  test("surfaces the original error when every package fails", async () => {
    await assert.rejects(
      runParallelFinalization(
        [1, 2],
        async (item) => {
          throw new Error(item === 1 ? "HTTP 422: first package invalid" : "HTTP 400: second package invalid");
        },
        undefined,
        undefined,
        { concurrency: 2 },
      ),
      /first package invalid/,
    );
  });
});

describe("deployed uploader compatibility export", () => {
  test("the historical runSequentialFinalization import now runs four finalizers concurrently", async () => {
    let active = 0;
    let maxActive = 0;
    const results = await runSequentialFinalization([1, 2, 3, 4, 5, 6], async (item) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 3));
      active -= 1;
      return item;
    });
    assert.equal(maxActive, 4);
    assert.deepEqual(results, [1, 2, 3, 4, 5, 6]);
  });
});
