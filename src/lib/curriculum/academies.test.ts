import test from "node:test";
import assert from "node:assert/strict";

import { isLessonVisible } from "./academies";

test("normalizes standard lessons to pro visibility", () => {
  for (const viewer of ["free", "basic", "pro", "gold", "admin"] as const) {
    assert.equal(
      isLessonVisible("standard", viewer),
      isLessonVisible("pro", viewer),
      `standard and pro should match for ${viewer}`,
    );
  }
});

test("normalizes premium lessons to gold visibility", () => {
  for (const viewer of ["free", "basic", "pro", "gold", "admin"] as const) {
    assert.equal(
      isLessonVisible("premium", viewer),
      isLessonVisible("gold", viewer),
      `premium and gold should match for ${viewer}`,
    );
  }
});
