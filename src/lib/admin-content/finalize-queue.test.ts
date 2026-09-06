import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { runSequentialFinalization } from "@/lib/admin-content/finalize-queue";

describe("runSequentialFinalization", () => {
  test("never overlaps package finalizers", async () => {
    let active = 0;
    let maxActive = 0;
    const order: number[] = [];
    const results = await runSequentialFinalization([1, 2, 3, 4], async (item) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 2));
      order.push(item);
      active -= 1;
      return item * 10;
    });
    assert.equal(maxActive, 1);
    assert.deepEqual(order, [1, 2, 3, 4]);
    assert.deepEqual(results, [10, 20, 30, 40]);
  });

  test("reports package-level progress", async () => {
    const progress: number[] = [];
    await runSequentialFinalization(["a", "b", "c"], async (item) => item, ({ percent }) => progress.push(percent));
    assert.deepEqual(progress, [33, 67, 100]);
  });

  test("retries a transient finalization failure without advancing to the next package", async () => {
    const visited: number[] = [];
    let attemptsForTwo = 0;
    const result = await runSequentialFinalization([1, 2, 3], async (item) => {
      visited.push(item);
      if (item === 2) {
        attemptsForTwo += 1;
        if (attemptsForTwo === 1) throw new Error("HTTP 504");
      }
      return item;
    });
    assert.deepEqual(result, [1, 2, 3]);
    assert.deepEqual(visited, [1, 2, 2, 3]);
  });

  test("continues to later packages after transient retries are exhausted", async () => {
    const visited: number[] = [];
    const results = await runSequentialFinalization([1, 2, 3], async (item) => {
      visited.push(item);
      if (item === 2) throw new Error("HTTP 504");
      return item;
    });
    assert.deepEqual(visited, [1, 2, 2, 2, 3]);
    assert.deepEqual(results, [1, 3]);
  });

  test("does not retry non-transient validation failures but continues the queue", async () => {
    const visited: number[] = [];
    const results = await runSequentialFinalization([1, 2, 3], async (item) => {
      visited.push(item);
      if (item === 2) throw new Error("HTTP 422: invalid curriculum filename");
      return item;
    });
    assert.deepEqual(visited, [1, 2, 3]);
    assert.deepEqual(results, [1, 3]);
  });
});
