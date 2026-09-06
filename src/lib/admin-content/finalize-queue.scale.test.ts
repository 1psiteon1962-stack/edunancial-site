import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { runSequentialFinalization } from "@/lib/admin-content/finalize-queue";

describe("runSequentialFinalization scale", () => {
  for (const size of [25, 50]) {
    test(`finalizes ${size} packages sequentially without overlap or loss`, async () => {
      const items = Array.from({ length: size }, (_, index) => index + 1);
      let active = 0;
      let maxActive = 0;
      const visited: number[] = [];
      const progress: Array<{ completed: number; total: number; percent: number }> = [];

      const results = await runSequentialFinalization(
        items,
        async (item) => {
          active += 1;
          maxActive = Math.max(maxActive, active);
          await Promise.resolve();
          visited.push(item);
          active -= 1;
          return `batch-${item}`;
        },
        (entry) => progress.push(entry),
      );

      assert.equal(maxActive, 1);
      assert.deepEqual(visited, items);
      assert.equal(results.length, size);
      assert.equal(results[0], "batch-1");
      assert.equal(results.at(-1), `batch-${size}`);
      assert.equal(progress.length, size);
      assert.deepEqual(progress.at(-1), { completed: size, total: size, percent: 100 });
    });
  }

  test("a transient failure in a 50-package queue retries that package and continues through package 50", async () => {
    const items = Array.from({ length: 50 }, (_, index) => index + 1);
    const visited: number[] = [];
    const progress: Array<{ completed: number; total: number; percent: number }> = [];

    const results = await runSequentialFinalization(
      items,
      async (item) => {
        visited.push(item);
        if (item === 26) throw new Error("HTTP 504 on package 26");
        return item;
      },
      (entry) => progress.push(entry),
    );

    assert.deepEqual(visited, [
      ...Array.from({ length: 26 }, (_, index) => index + 1),
      26,
      26,
      ...Array.from({ length: 24 }, (_, index) => index + 27),
    ]);
    assert.equal(visited.includes(27), true);
    assert.equal(visited.at(-1), 50);
    assert.equal(results.length, 49);
    assert.equal(results.includes(26), false);
    assert.deepEqual(progress.at(-1), { completed: 50, total: 50, percent: 100 });
  });
});
