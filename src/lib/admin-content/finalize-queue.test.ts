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

  test("stops before later packages when one request fails", async () => {
    const visited: number[] = [];
    await assert.rejects(
      runSequentialFinalization([1, 2, 3], async (item) => {
        visited.push(item);
        if (item === 2) throw new Error("HTTP 504");
        return item;
      }),
      /504/,
    );
    assert.deepEqual(visited, [1, 2]);
  });
});
