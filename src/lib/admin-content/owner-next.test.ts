import assert from "node:assert/strict";
import test from "node:test";

import { safeOwnerNext } from "./owner-next";

test("allows same-site admin and executive paths", () => {
  assert.equal(safeOwnerNext("/admin/site-access"), "/admin/site-access");
  assert.equal(safeOwnerNext("/executive/dashboard"), "/executive/dashboard");
  assert.equal(safeOwnerNext("/admin"), "/admin");
});

test("rejects other sites and unsafe values", () => {
  for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "/admin//x", "/members", "/adminx", "", " ", null, 5, "/admin/<script>"]) {
    assert.equal(safeOwnerNext(bad), null, String(bad));
  }
});
