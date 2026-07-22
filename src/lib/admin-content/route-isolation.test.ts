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
});
