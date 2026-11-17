import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { SQUARE_REQUEST_TIMEOUT_MS, squareTimeoutSignal } from "./square-timeout";

test("Square calls time out after 15 seconds", () => {
  assert.equal(SQUARE_REQUEST_TIMEOUT_MS, 15_000);
  assert.ok(squareTimeoutSignal() instanceof AbortSignal);
});

test("every Square fetch carries the timeout signal", () => {
  for (const file of [
    "src/lib/square.ts",
    "src/lib/payments/squareFulfillment.ts",
    "src/app/api/square/payment-link/route.ts",
    "src/app/api/admin/payments/refund/route.ts",
  ]) {
    const source = readFileSync(file, "utf8");
    const fetches = source.match(/await fetch\(/g)?.length ?? 0;
    const signals = source.match(/squareTimeoutSignal\(\)/g)?.length ?? 0;
    assert.ok(fetches > 0 && signals >= fetches, `${file}: ${fetches} fetch, ${signals} timeout`);
  }
});
