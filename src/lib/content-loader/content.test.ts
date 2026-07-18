import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { composeNextContent } from "@/lib/content-loader/content";

describe("content-loader composition", () => {
  test("append mode preserves existing content", () => {
    const result = composeNextContent("Existing line", "New line", "append");
    assert.equal(result, "Existing line\nNew line");
  });

  test("replace mode overwrites existing content", () => {
    const result = composeNextContent("Old content", "New content", "replace");
    assert.equal(result, "New content");
  });
});
