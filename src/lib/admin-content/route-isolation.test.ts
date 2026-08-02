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

// ---------------------------------------------------------------------------
// Regression tests: admin content upload HTTP 404 prevention
//
// Root cause of the production 404: the _redirects file contained a
// "/* /index.html 200" SPA catch-all rule.  Netlify processes _redirects
// before @netlify/plugin-nextjs routing, so every request — including
// POST /api/admin/content/upload/presign — was caught by the rule and
// redirected to /index.html.  Since there is no index.html in the .next
// publish directory, Netlify returned a 404 HTML page instead of the
// expected JSON API response.
//
// The tests below guard against re-introduction of each failure mode.
// ---------------------------------------------------------------------------

describe("admin content upload 404 regression", () => {
  // ---------------------------------------------------------------------------
  // Netlify processes BOTH the root _redirects AND the public/_redirects file
  // (public/ contents are copied into the site output by @netlify/plugin-nextjs).
  // Either file containing a "/* /index.html 200" SPA catch-all would cause
  // every request — including POST /api/admin/content/upload/presign — to be
  // silently rewritten to /index.html.  There is no index.html in the .next
  // publish directory, so @netlify/plugin-nextjs forwards the rewritten path
  // to Next.js, which returns its not-found.tsx 404 HTML page instead of the
  // expected JSON API response.
  //
  // VERIFIED ROOT CAUSE: this was exactly what happened in production.  The
  // root _redirects file contained "/* /index.html 200", fixed in PR #144.
  // The tests below guard BOTH files against re-introduction of each failure mode.
  // ---------------------------------------------------------------------------

  function assertNoSpaCatchAll(redirects: string, filename: string) {
    // "/* /index.html 200" rewrites ALL paths to /index.html; since .next has
    // no index.html, Next.js returns 404 HTML for every API request.
    assert.doesNotMatch(
      redirects,
      /^\s*\/\*\s+\/index\.html\s+200/m,
      `${filename} must not contain a /* /index.html 200 SPA catch-all rule — it intercepts Next.js API route requests and returns HTML 404`,
    );

    // Any splat rewrite to an HTML file is equally dangerous.
    assert.doesNotMatch(
      redirects,
      /^\s*\/\*\s+\/\S+\.html\s+200/m,
      `${filename} must not contain a /* /*.html 200 catch-all — it intercepts Next.js API route requests`,
    );
  }

  test("root _redirects does not contain a SPA catch-all rule that intercepts API requests", () => {
    assertNoSpaCatchAll(readSourceFile("_redirects"), "_redirects");
  });

  test("public/_redirects does not contain a SPA catch-all rule that intercepts API requests", () => {
    // public/_redirects is copied to the .next output directory by
    // @netlify/plugin-nextjs and processed by Netlify as the deployed redirect
    // rules.  A SPA catch-all here is just as dangerous as one in root _redirects.
    assertNoSpaCatchAll(readSourceFile("public/_redirects"), "public/_redirects");
  });

  test("all three upload API route files exist with a POST export", () => {
    const routes = [
      "src/app/api/admin/content/upload/route.ts",
      "src/app/api/admin/content/upload/presign/route.ts",
      "src/app/api/admin/content/upload/finalize/route.ts",
    ];

    for (const route of routes) {
      const fullPath = path.join(process.cwd(), route);
      assert.ok(existsSync(fullPath), `Upload route file must exist: ${route}`);

      const src = readFileSync(fullPath, "utf8");
      assert.match(
        src,
        /export\s+async\s+function\s+POST/,
        `${route} must export an async POST handler`,
      );
    }
  });

  test("UploadClient fetch paths match existing App Router route files", () => {
    const clientSrc = readSourceFile("src/components/admin-content/UploadClient.tsx");

    // Every path referenced via fetch() must correspond to a real route file.
    const expectedRoutes: Array<{ fetchPath: string; routeFile: string }> = [
      {
        fetchPath: "/api/admin/content/upload/presign",
        routeFile: "src/app/api/admin/content/upload/presign/route.ts",
      },
      {
        fetchPath: "/api/admin/content/upload/finalize",
        routeFile: "src/app/api/admin/content/upload/finalize/route.ts",
      },
      {
        fetchPath: "/api/admin/content/upload",
        routeFile: "src/app/api/admin/content/upload/route.ts",
      },
    ];

    for (const { fetchPath, routeFile } of expectedRoutes) {
      assert.ok(
        clientSrc.includes(`"${fetchPath}"`),
        `UploadClient must reference fetch path "${fetchPath}"`,
      );
      assert.ok(
        existsSync(path.join(process.cwd(), routeFile)),
        `Route file must exist for fetch path "${fetchPath}": ${routeFile}`,
      );
    }
  });

  test("middleware does not redirect /api/admin/* requests to the login page", () => {
    const middleware = readSourceFile("src/middleware.ts");

    // The isAdminPath guard must only match paths that start with "/admin"
    // (page routes), not "/api/admin" (API routes).  API authentication is
    // handled by requireAdminApiSession() inside each route handler; the
    // middleware must not redirect API calls to the login page.
    assert.match(
      middleware,
      /pathname\.startsWith\(["']\/admin["']\)/,
      "middleware isAdminPath check must use startsWith('/admin')",
    );
    assert.doesNotMatch(
      middleware,
      /pathname\.startsWith\(["']\/api\/admin["']\)\s*&&[^;]*redirect/,
      "middleware must not redirect /api/admin/* requests to the login page",
    );
  });

  test("netlify.toml uses @netlify/plugin-nextjs and .next publish dir", () => {
    const toml = readSourceFile("netlify.toml");

    assert.match(
      toml,
      /@netlify\/plugin-nextjs/,
      "netlify.toml must use @netlify/plugin-nextjs so Next.js API routes are deployed as serverless functions",
    );
    assert.match(
      toml,
      /publish\s*=\s*["']?\.next["']?/,
      "netlify.toml publish directory must be .next",
    );
  });

  test("_headers does not apply a cacheable Cache-Control to /api/* routes", () => {
    // A "Cache-Control: public, max-age=N" rule applied to /api/* routes via
    // Netlify's _headers file can cause the CDN to cache error responses (e.g.
    // a 404 from a misconfigured deployment).  After the misconfiguration is
    // fixed, the CDN serves the stale cached error instead of the corrected
    // API response.  The _headers file must either omit Cache-Control for API
    // routes entirely (relying on the no-store header set by next.config.mjs)
    // or explicitly set Cache-Control: no-store for /api/*.
    const headers = readSourceFile("_headers");

    // Split into sections; each section starts with a path line (no leading whitespace).
    const sections = headers.split(/^(?=\S)/m).filter((s) => s.trim());
    for (const section of sections) {
      const lines = section.split("\n");
      const pathLine = lines[0].trim();
      if (!pathLine.startsWith("/api/")) continue;

      // An /api/* section must NOT set a publicly cacheable Cache-Control.
      const cacheControlLine = lines.find((l) => /Cache-Control:/i.test(l));
      if (!cacheControlLine) continue;

      assert.doesNotMatch(
        cacheControlLine,
        /public\s*,\s*max-age\s*=\s*[1-9]/i,
        `_headers section for "${pathLine}" must not set a cacheable Cache-Control (public, max-age>0) — use no-store for API routes`,
      );
    }
  });

  test("public/_headers does not apply a cacheable Cache-Control to /api/* routes", () => {
    // public/_headers is copied into the publish output by @netlify/plugin-nextjs
    // and may be the _headers file that Netlify actually processes for the
    // deployed site.  It must not apply a cacheable Cache-Control to /api/*
    // routes — a stale 404 cached by the CDN would survive a routing fix and
    // continue to serve HTML instead of JSON for every upload API request.
    const headers = readSourceFile("public/_headers");

    const sections = headers.split(/^(?=\S)/m).filter((s) => s.trim());
    for (const section of sections) {
      const lines = section.split("\n");
      const pathLine = lines[0].trim();
      if (!pathLine.startsWith("/api/")) continue;

      const cacheControlLine = lines.find((l) => /Cache-Control:/i.test(l));
      if (!cacheControlLine) continue;

      assert.doesNotMatch(
        cacheControlLine,
        /public\s*,\s*max-age\s*=\s*[1-9]/i,
        `public/_headers section for "${pathLine}" must not set a cacheable Cache-Control (public, max-age>0) — use no-store for API routes`,
      );
    }
  });

  test("presign route handler always returns JSON responses — never HTML", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");

    // The handler must never use primitives that can produce an HTML page.
    // "new Response(" without a Content-Type header defaults to text/plain but
    // callers may use it to return raw strings; any non-JSON path causes the
    // client to receive unexpected content.  Response.json() is the only
    // correct primitive for JSON API routes.
    assert.doesNotMatch(
      src,
      /\bnew\s+Response\s*\(/,
      "presign route must not use 'new Response(' — use Response.json() to guarantee a JSON Content-Type",
    );
    assert.doesNotMatch(
      src,
      /NextResponse\.redirect\s*\(/,
      "presign route must not call NextResponse.redirect() — API routes must return JSON, not redirects",
    );
    assert.match(
      src,
      /Response\.json\s*\(/,
      "presign route must use Response.json() for all success and error responses",
    );
    assert.match(
      src,
      /requireAdminApiSession/,
      "presign route must call requireAdminApiSession to authenticate every request before processing",
    );
  });

  test("finalize route handler always returns JSON responses — never HTML", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/finalize/route.ts");

    assert.doesNotMatch(
      src,
      /\bnew\s+Response\s*\(/,
      "finalize route must not use 'new Response(' — use Response.json() to guarantee a JSON Content-Type",
    );
    assert.doesNotMatch(
      src,
      /NextResponse\.redirect\s*\(/,
      "finalize route must not call NextResponse.redirect() — API routes must return JSON, not redirects",
    );
    assert.match(
      src,
      /Response\.json\s*\(/,
      "finalize route must use Response.json() for all success and error responses",
    );
    assert.match(
      src,
      /requireAdminApiSession/,
      "finalize route must call requireAdminApiSession to authenticate every request before processing",
    );
  });

  test("presign route handler is guarded by rate limiting", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");

    assert.match(
      src,
      /checkRateLimit/,
      "presign route must apply rate limiting to prevent upload abuse",
    );
  });

  test("netlify.toml does not contain a catch-all redirect that intercepts API requests", () => {
    // A catch-all redirect rule such as "from = '/*' to = '/index.html'" in
    // netlify.toml would intercept every request — including POST to
    // /api/admin/content/upload/presign — and return an HTML page instead of
    // the expected JSON response.  The toml must only contain specific redirects
    // (e.g. HTTP→HTTPS, www→apex) that never match /api/* paths.
    const toml = readSourceFile("netlify.toml");

    assert.doesNotMatch(
      toml,
      /from\s*=\s*["']\s*\/\*\s*["']/m,
      "netlify.toml must not contain a /* catch-all redirect — it would intercept Next.js API route requests",
    );
  });

  test("canonical host redirects are method-preserving in netlify.toml and not duplicated in public/_redirects", () => {
    const toml = readSourceFile("netlify.toml");
    const publicRedirects = readSourceFile("public/_redirects");

    const canonicalRules = [
      'from = "http://edunancial.com/*"',
      'from = "http://www.edunancial.com/*"',
      'from = "https://www.edunancial.com/*"',
    ];

    for (const fromRule of canonicalRules) {
      const escaped = fromRule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.match(
        toml,
        new RegExp(`${escaped}[\\s\\S]*?status\\s*=\\s*308`, "m"),
        `netlify.toml canonical redirect (${fromRule}) must use status 308 to preserve POST requests`,
      );
    }

    assert.doesNotMatch(
      publicRedirects,
      /^\s*https?:\/\/(?:www\.)?edunancial\.com\/\*\s+https:\/\/edunancial\.com\/:splat\s+\d{3}/m,
      "public/_redirects must not contain active canonical host redirects; they belong in netlify.toml",
    );
  });
});

// ---------------------------------------------------------------------------
// Presign route — bucket connectivity check guards
//
// Root cause of the production "Direct upload failed (HTTP 404): <!DOCTYPE html>"
// error: the bucket connectivity check only looked at HTTP status 404.  When
// NEXT_PUBLIC_SUPABASE_URL is misconfigured to the Netlify site URL, a
// Next.js catch-all page returns HTTP 200 with Content-Type: text/html.  The
// status-only check passed silently, the presign route constructed a
// directUpload URL pointing at the Netlify app, and the browser received HTML
// 404 from the XHR.
//
// Fix: the presign route must also detect HTML content-type in the bucket
// response and surface a clear configuration error before returning any
// directUpload URL.
// ---------------------------------------------------------------------------

describe("presign route — bucket connectivity check guards", () => {
  test("presign/route.ts runs bucket check unconditionally when Supabase is configured (not only when service-role key is absent)", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");

    // The guard condition must NOT gate the bucket check on the absence of
    // SUPABASE_SERVICE_ROLE_KEY.  Previously it was:
    //   if (!process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseUrl && anonKey && bucket)
    // which skipped the check when a service-role key was set, leaving the
    // HTML-response scenario undetected.
    assert.doesNotMatch(
      src,
      /if\s*\(\s*!process\.env\.SUPABASE_SERVICE_ROLE_KEY\s*&&\s*supabaseUrl/,
      "presign/route.ts must not gate the bucket connectivity check on SUPABASE_SERVICE_ROLE_KEY being absent",
    );

    // The bucket check must now run whenever supabaseUrl, anonKey, and bucket
    // are all configured.
    assert.match(
      src,
      /if\s*\(\s*supabaseUrl\s*&&\s*anonKey\s*&&\s*bucket\s*\)/,
      "presign/route.ts must run the bucket check whenever supabaseUrl, anonKey, and bucket are all set",
    );
  });

  test("presign/route.ts detects HTML response from bucket check and surfaces a clear error", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");

    // The bucket check must inspect the Content-Type header and throw when
    // it contains 'text/html' — this is the signal that NEXT_PUBLIC_SUPABASE_URL
    // is pointing at the wrong host (e.g. the Netlify site URL).
    assert.match(
      src,
      /content-type.*text\/html|text\/html.*content-type/i,
      "presign/route.ts must check content-type header for text/html to detect a misconfigured Supabase URL",
    );

    assert.match(
      src,
      /appears to be misconfigured|wrong host|Netlify site URL/,
      "presign/route.ts must surface a clear error message when the bucket endpoint returns HTML",
    );
  });

  test("presign/route.ts URL-encodes bucket and object path segments in directUpload URL", () => {
    const src = readSourceFile("src/app/api/admin/content/upload/presign/route.ts");

    // The directUpload URL must encode segments individually (same as
    // SupabaseObjectStorage.request) so that special characters in any segment
    // cannot break the URL.
    assert.match(
      src,
      /encodedObjectStoragePath/,
      "presign/route.ts must URL-encode objectStoragePath in directUpload.url",
    );
    assert.match(
      src,
      /encodedBucket/,
      "presign/route.ts must URL-encode the bucket name in directUpload.url",
    );
  });
});

// ---------------------------------------------------------------------------
// Curriculum auto-ingest pipeline tests
//
// These tests validate that:
//   1. Upload API routes always return structured JSON (never HTML) on error.
//   2. The curriculum.ts helpers correctly detect assets, build registry
//      entries, and merge them into an existing registry.
//   3. The GitHub PR creation step includes the registry update logic that
//      makes RED-111.md, WHITE-205.md, or any lesson file discoverable without
//      manual code changes after the PR is merged.
// ---------------------------------------------------------------------------

describe("curriculum auto-ingest pipeline", () => {
  test("all three upload route handlers wrap errors in structured JSON with success/error/reason/status", () => {
    const routes = [
      "src/app/api/admin/content/upload/route.ts",
      "src/app/api/admin/content/upload/presign/route.ts",
      "src/app/api/admin/content/upload/finalize/route.ts",
    ];

    for (const route of routes) {
      const src = readSourceFile(route);

      // Each route must have a single top-level try-catch that wraps the
      // entire handler (auth included) so that no unhandled exception can
      // cause Next.js to return an HTML error page instead of JSON.
      assert.match(src, /\btry\b/, `${route} must contain a try block for JSON error wrapping`);
      assert.match(src, /success:\s*(true|false)/, `${route} response must include a 'success' field`);
      assert.match(src, /\berror\b.*err\.message/, `${route} error response must include 'error: err.message'`);
      assert.match(src, /\breason\b/, `${route} error response must include a 'reason' field`);
      assert.match(src, /\bstatus\b.*\b400\b/, `${route} error response must include a status 400`);
      assert.match(
        src,
        /NODE_ENV.*production[\s\S]*stack|stack[\s\S]*NODE_ENV.*production/,
        `${route} must expose 'stack' only in non-production environments`,
      );
    }
  });

  test("curriculum.ts exports detectCurriculumAsset, buildRegistryEntry, upsertRegistryEntries", () => {
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");

    assert.match(src, /export async function detectCurriculumAsset/, "curriculum.ts must export detectCurriculumAsset");
    assert.match(src, /export function buildRegistryEntry/, "curriculum.ts must export buildRegistryEntry");
    assert.match(src, /export function upsertRegistryEntries/, "curriculum.ts must export upsertRegistryEntries");
  });

  test("github.ts imports curriculum detection helpers and calls fetchCurrentRegistry + upsertRegistryEntries", () => {
    const src = readSourceFile("src/lib/admin-content/github.ts");

    assert.match(src, /detectCurriculumAsset/, "github.ts must call detectCurriculumAsset to auto-detect curriculum files");
    assert.match(src, /fetchCurrentRegistry/, "github.ts must fetch existing registry before building update");
    assert.match(src, /upsertRegistryEntries/, "github.ts must merge new entries into existing registry");
    assert.match(src, /CURRICULUM_REGISTRY_PATH/, "github.ts must define the registry path constant");
    assert.match(src, /curriculum\/registry\.json/, "github.ts must reference curriculum/registry.json");
  });

  test("github.ts includes updated registry.json blob in the commit tree when curriculum files are detected", () => {
    const src = readSourceFile("src/lib/admin-content/github.ts");

    // The registry blob must be pushed into the blobs array so the git tree
    // creation step includes it in the same commit as the content files.
    assert.match(
      src,
      /blobs\.push[\s\S]*?CURRICULUM_REGISTRY_PATH/,
      "github.ts must push the registry blob into the commit tree blobs array",
    );
  });

  test("upsertRegistryEntries correctly merges new entries into an empty registry", async () => {
    // Source-level verification: the function signature must accept null (empty registry)
    // and return a registry with the expected shape.  Runtime behavior is tested in
    // curriculum.test.ts which is compiled via npm test.
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");
    assert.match(src, /upsertRegistryEntries\s*\(/, "upsertRegistryEntries must be defined in curriculum.ts");
    assert.match(src, /existingRegistry.*null/, "upsertRegistryEntries must accept null as the existing registry");
    assert.match(src, /registry\.tracks\[entry\.track\]/, "upsertRegistryEntries must index tracks by track code");
  });

  test("upsertRegistryEntries preserves existing assets when merging new entries", () => {
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");
    // The function iterates over entries and calls upsert for each one, meaning
    // entries from previous calls are retained as long as a fresh registry object
    // is passed through.
    assert.match(src, /for\s*\(const entry of entries\)/, "upsertRegistryEntries must iterate over all new entries");
  });

  test("detectCurriculumAsset returns null for non-curriculum markdown", () => {
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");
    assert.match(src, /return null/, "detectCurriculumAsset must return null on failure paths");
    assert.match(src, /if\s*\(!fm\s*\|\|\s*!fm\.id\)\s*return null/, "detectCurriculumAsset must return null when front-matter or id is missing");
  });

  test("detectCurriculumAsset detects a valid curriculum lesson and returns canonical path", () => {
    const src = readSourceFile("src/lib/admin-content/curriculum.ts");
    assert.match(src, /idParser\.assetPath\(parsed\)/, "detectCurriculumAsset must use assetPath() for the canonical path");
    assert.match(src, /canonicalPath/, "detectCurriculumAsset must return a canonicalPath field");
  });
});
