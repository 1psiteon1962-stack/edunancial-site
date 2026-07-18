import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { buildCuDestinationPath } from "@/lib/cu/publish";

describe("CU publishing", () => {
  test("maps courses into curriculum folders", () => {
    assert.equal(
      buildCuDestinationPath({
        id: "1",
        name: "lesson.md",
        extension: ".md",
        mimeType: "text/markdown",
        size: 10,
        category: "courses",
        track: "WHITE",
        language: "english",
        level: 2,
        contentBase64: Buffer.from("lesson").toString("base64"),
      }),
      "content/curriculum/WHITE/L2/lesson.md",
    );
  });

  test("maps downloads into public download folders", () => {
    assert.equal(
      buildCuDestinationPath({
        id: "2",
        name: "Workbook Final.pdf",
        extension: ".pdf",
        mimeType: "application/pdf",
        size: 10,
        category: "downloads",
        track: "BLUE",
        language: "spanish",
        level: 5,
        contentBase64: Buffer.from("pdf").toString("base64"),
      }),
      "public/downloads/spanish/BLUE/L5/Workbook-Final.pdf",
    );
  });
});
