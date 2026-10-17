import assert from "node:assert/strict";
import test from "node:test";
import { assertWorkspaceClearHasNoBatches } from "@/lib/admin-content/deletion";

test("workspace clear refuses any batch before publication state is touched", () => {
  for (const count of [1, 2, 50]) assert.throws(() => assertWorkspaceClearHasNoBatches(count), /may remove published curriculum/);
});
test("workspace clear permits empty batch index", () => {
  assert.doesNotThrow(() => assertWorkspaceClearHasNoBatches(0));
});
test("workspace clear rejects invalid counts closed", () => {
  for (const count of [-1, NaN, Infinity, 1.5]) assert.throws(() => assertWorkspaceClearHasNoBatches(count), /Invalid workspace batch count/);
});
