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
});

describe("admin content upload 404 regression", () => {
  function assertNoSpaCatchAll(redirects: string, filename: string) {
    assert.doesNotMatch(redirects, /^\s*\/\*\s+\/index\.html\s+200/m, `${filename} must not contain a SPA catch-all`);
    assert.doesNotMatch(redirects, /^\s*\/\*\s+\/\S+\.html\s+200/m, `${filename} must not contain an HTML catch-all`);
  }
  test("root _redirects does not contain a SPA catch-all rule that intercepts API requests", () => assertNoSpaCatchAll(readSourceFile("_redirects"), "_redirects"));
  test("public/_redirects does not contain a SPA catch-all rule that intercepts API requests", () => assertNoSpaCatchAll(readSourceFile("public/_redirects"), "public/_redirects"));
  test("all three upload API route files exist with a POST export", () => {
    const routes = ["src/app/api/admin/content/upload/route.ts", "src/app/api/admin/content/upload/presign/route.ts", "src/app/api/admin/content/upload/finalize/route.ts"];
    for (const route of routes) {
      assert.ok(existsSync(path.join(process.cwd(), route)), `Upload route file must exist: ${route}`);
      assert.match(readSourceFile(route), /export\s+async\s+function\s+POST/);
    }
  });
  test("UploadClient fetch paths match existing App Router route files", () => {
    const clientSrc = readSourceFile("src/components/admin-content/UploadClient.tsx");
    const expectedRoutes = [
      ["/api/admin/content/upload/presign", "src/app/api/admin/content/upload/presign/route.ts"],
      ["/api/admin/content/upload/finalize", "src/app/api/admin/content/upload/finalize/route.ts"],
      ["/api/admin/content/upload", "src/app/api/admin/content/upload/route.ts"],
    ];
    for (const [fetchPath, routeFile] of expectedRoutes) {
      assert.ok(clientSrc.includes(`"${fetchPath}"`));
      assert.ok(existsSync(path.join(process.cwd(), routeFile)));
    }
  });
  test("middleware does not redirect /api/admin/* requests to the login page", () => {
    const middleware = readSourceFile("src/middleware.ts");
    assert.match(middleware, /pathname\.startsWith\(["']\/admin["']\)/);
    assert.doesNotMatch(middleware, /pathname\.startsWith\(["']\/api\/admin["']\)\s*&&[^;]*redirect/);
  });
  test("netlify.toml uses @netlify/plugin-nextjs and .next publish dir", () => {
    const toml = readSourceFile("netlify.toml");
    assert.match(toml, /@netlify\/plugin-nextjs/);
    assert.match(toml, /publish\s*=\s*["']?\.next["']?/);
  });
  for (const filename of ["_headers", "public/_headers"]) {
    test(`${filename} does not apply a cacheable Cache-Control to /api/* routes`, () => {
      const sections = readSourceFile(filename).split(/^(?=\S)/m).filter((s) => s.trim());
      for (const section of sections) {
        const lines = section.split("\n");
        if (!lines[0].trim().startsWith("/api/")) continue;
        const cacheControlLine = lines.find((line) => /Cache-Control:/i.test(line));
        if (cacheControlLine) assert.doesNotMatch(cacheControlLine, /public\s*,\s*max-age\s*=\s*[1-9]/i);
      }
    });
  }
  test("netlify.toml does not contain a catch-all redirect that intercepts API requests", () => assert.doesNotMatch(readSourceFile("netlify.toml"), /from\s*=\s*["']\s*\/\*\s*["']/m));
  test("canonical host redirects are method-preserving in netlify.toml and not duplicated in public/_redirects", () => {
    const toml = readSourceFile("netlify.toml");
    for (const fromRule of ['from = "http://edunancial.com/*"', 'from = "http://www.edunancial.com/*"', 'from = "https://www.edunancial.com/*"']) {
      const escaped = fromRule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.match(toml, new RegExp(`${escaped}[\\s\\S]*?status\\s*=\\s*308`, "m"));
    }
    assert.doesNotMatch(readSourceFile("public/_redirects"), /^\s*https?:\/\/(?:www\.)?edunancial\.com\/\*\s+https:\/\/edunancial\.com\/:splat\s+\d{3}/m);
  });
});

describe("GitHub-backed presign route", () => {
  test("uses the authenticated server upload endpoint and no Supabase credentials", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");
    assert.match(src, /\/api\/admin\/content\/upload\/blob\?/);
    assert.match(src, /"x-csrf-token": csrfToken/);
    assert.match(src, /signedUrl:\s*null/);
    assert.doesNotMatch(src, /SUPABASE|supabase|anonKey|serviceRoleKey/);
  });
});

describe("curriculum auto-ingest pipeline", () => {
  test("all three upload route handlers wrap errors in structured JSON with success/error/reason/status", () => {
    const routes = ["src/app/api/admin/content/upload/route.ts", "src/app/api/admin/content/upload/presign/route.ts", "src/app/api/admin/content/upload/finalize/route.ts"];
    for (const route of routes) {
      const src = readSourceFile(route);
      assert.match(src, /\btry\b/);
      assert.match(src, /success:\s*(true|false)/);
      assert.match(src, /\berror\b.*err\.message/);
      assert.match(src, /\breason\b/);
      assert.match(src, /\bstatus\b.*\b400\b/);
    }
  });
  test("curriculum.ts exports detectCurriculumAsset, buildRegistryEntry, upsertRegistryEntries", () => {
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");
    assert.match(src, /export\s+(?:async\s+)?function\s+detectCurriculumAsset/);
    assert.match(src, /export\s+function\s+buildRegistryEntry/);
    assert.match(src, /export\s+function\s+upsertRegistryEntries/);
  });
  test("github.ts imports curriculum detection helpers and calls fetchCurrentRegistry + upsertRegistryEntries", () => {
    const src = readSourceFile("src/lib/admin-content/github.ts");
    assert.match(src, /detectCurriculumAsset/);
    assert.match(src, /fetchCurrentRegistry/);
    assert.match(src, /upsertRegistryEntries/);
  });
  test("github.ts includes the authoritative curriculum registry blob in the commit tree when curriculum files are detected", () => {
    const src = readSourceFile("src/lib/admin-content/github.ts");
    assert.match(src, /CURRICULUM_REGISTRY_PATH\s*=\s*["']curriculum\/registry\.json["']/);
    assert.match(src, /path:\s*CURRICULUM_REGISTRY_PATH/);
  });
});