import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

function readSourceFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("admin and executive route isolation", () => {
  test("keeps the root app layout free of public providers and chrome", () => {
    const rootLayout = readSourceFile("src/app/layout.tsx");

    assert.doesNotMatch(rootLayout, /Providers/);
    assert.doesNotMatch(rootLayout, /InternationalPreferencesProvider/);
    assert.doesNotMatch(rootLayout, /SiteChrome/);
  });

  test("moves public providers and chrome into the public route group", () => {
    const publicLayout = readSourceFile("src/app/(public)/layout.tsx");

    assert.match(publicLayout, /Providers/);
    assert.match(publicLayout, /InternationalPreferencesProvider/);
    assert.match(publicLayout, /SiteChrome/);
  });

  test("keeps executive layout free of navigation chrome", () => {
    const executiveLayout = readSourceFile("src/app/executive/layout.tsx");

    assert.doesNotMatch(executiveLayout, /ExecutiveNav/);
  });

  test("keeps content-loader route outside the public route group", () => {
    assert.equal(existsSync(path.join(process.cwd(), "src/app/content-loader/page.tsx")), true);
    assert.equal(existsSync(path.join(process.cwd(), "src/app/(public)/content-loader/page.tsx")), false);
  });
});
