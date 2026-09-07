import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { DEFAULT_FINALIZE_CONCURRENCY, runSequentialFinalization } from "@/lib/admin-content/finalize-queue";

describe("bulk finalization scale", () => {
  for (const size of [25, 50]) {
    test(`finalizes ${size} packages with bounded parallelism and no loss`, async () => {
      const items = Array.from({ length: size }, (_, index) => index + 1);
      let active = 0;
      let maxActive = 0;
      const visited = new Set<number>();
      const progress: Array<{ completed: number; total: number; percent: number }> = [];

      const results = await runSequentialFinalization(
        items,
        async (item) => {
          active += 1;
          maxActive = Math.max(maxActive, active);
          await new Promise((resolve) => setTimeout(resolve, 1));
          visited.add(item);
          active -= 1;
          return `batch-${item}`;
        },
        (entry) => progress.push(entry),
      );

      assert.equal(maxActive, DEFAULT_FINALIZE_CONCURRENCY);
      assert.equal(visited.size, size);
      assert.equal(results.length, size);
      assert.equal(results[0], "batch-1");
      assert.equal(results.at(-1), `batch-${size}`);
      assert.equal(progress.length, size);
      assert.deepEqual(progress.at(-1), { completed: size, total: size, percent: 100 });
    });
  }

  test("a transient failure in a 50-package queue retries that package while later packages continue", async () => {
    const items = Array.from({ length: 50 }, (_, index) => index + 1);
    const attempts = new Map<number, number>();
    const progress: Array<{ completed: number; total: number; percent: number }> = [];

    const results = await runSequentialFinalization(
      items,
      async (item) => {
        attempts.set(item, (attempts.get(item) ?? 0) + 1);
        if (item === 26) throw new Error("HTTP 504 on package 26");
        return item;
      },
      (entry) => progress.push(entry),
    );

    assert.equal(attempts.get(26), 3);
    assert.equal(attempts.has(27), true);
    assert.equal(attempts.has(50), true);
    assert.equal(results.length, 49);
    assert.equal(results.includes(26), false);
    assert.equal(results.at(-1), 50);
    assert.deepEqual(progress.at(-1), { completed: 50, total: 50, percent: 100 });
  });
});
