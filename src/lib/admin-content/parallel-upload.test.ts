import { describe, expect, it } from "vitest";

import { runParallelUploads } from "@/lib/admin-content/parallel-upload";

describe("runParallelUploads", () => {
  it("never exceeds the configured concurrency", async () => {
    let active = 0;
    let maximumActive = 0;

    await runParallelUploads(
      [10, 20, 30, 40, 50, 60],
      async (size, _index, report) => {
        active += 1;
        maximumActive = Math.max(maximumActive, active);
        report(size / 2);
        await new Promise((resolve) => setTimeout(resolve, 5));
        report(size);
        active -= 1;
      },
      { concurrency: 3, sizeOf: (size) => size },
    );

    expect(maximumActive).toBe(3);
  });

  it("reports aggregate byte-weighted progress", async () => {
    const percents: number[] = [];

    await runParallelUploads(
      [100, 300],
      async (size, _index, report) => {
        report(size / 2);
        await Promise.resolve();
        report(size);
      },
      {
        concurrency: 2,
        sizeOf: (size) => size,
        onProgress: ({ percent }) => percents.push(percent),
      },
    );

    expect(percents.at(-1)).toBe(100);
    expect(percents).toContain(13);
    expect(percents).toContain(50);
  });
});
