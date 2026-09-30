import assert from "node:assert/strict";
import test from "node:test";
import { listRestorationCoordinates } from "@/lib/curriculum/restoration-matrix";

test("global restoration planning space contains all configured L1-L5 levels", () => {
  const coordinates = listRestorationCoordinates();
  const levels = new Set(coordinates.map((entry) => entry.level));
  for (const level of ["level-1","level-2","level-3","level-4","level-5"]) assert.equal(levels.has(level as never), true);
  assert.equal(coordinates.length > 0, true);
});
