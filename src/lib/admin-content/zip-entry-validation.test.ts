import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { validateFileType } from "@/lib/admin-content/security";

describe("ZIP member validation", () => {
  test("detects an image entry from its own bytes even when the archive MIME is supplied", () => {
    const png = Buffer.from("89504e470d0a1a0a00000000", "hex");
    const result = validateFileType("lesson-image.png", "application/zip", png);

    assert.equal(result.extension, ".png");
    assert.equal(result.detectedMime, "image/png");
  });

  test("allows text lesson entries without inheriting archive MIME semantics", () => {
    const lesson = Buffer.from("# Lesson 1\nCompound interest grows over time.\n", "utf8");
    const result = validateFileType(
      "RED-L2-001.md",
      "application/octet-stream",
      lesson,
    );

    assert.equal(result.extension, ".md");
    assert.equal(result.detectedMime, "application/octet-stream");
  });
});
