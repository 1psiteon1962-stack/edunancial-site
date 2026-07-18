import assert from "node:assert/strict";
import test from "node:test";

import { buildCuDestinationOptions, mergeCuContent } from "@/lib/cu/workbench";

test("builds curriculum and staging destination options for lesson content", () => {
  const options = buildCuDestinationOptions({
    track: "BLUE",
    category: "lessons",
    level: 3,
    language: "es",
    content: "# Budget Basics\n\nPlain text lesson body",
  });

  assert.deepEqual(options.map((option) => option.value), [
    "content/curriculum/BLUE/L3/blue-l3-budget-basics.md",
    "curriculum/staging/content-upload/lessons/es/blue-l3-budget-basics.md",
  ]);
});

test("appends pasted content with a blank line separator", () => {
  assert.equal(
    mergeCuContent("Existing paragraph\n", "New paragraph", "append"),
    "Existing paragraph\n\nNew paragraph\n",
  );
});

test("replaces content when replace mode is selected", () => {
  assert.equal(mergeCuContent("Old body", "New body", "replace"), "New body\n");
});
