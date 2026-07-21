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
  test("_redirects does not contain a SPA catch-all rule that intercepts API requests", () => {
    const redirects = readSourceFile("_redirects");

    // A "/* /index.html 200" rule (or any variant) would cause Netlify to
    // serve /index.html for every path, including API routes, which produces
    // an HTML 404 page instead of a JSON API response.
    assert.doesNotMatch(
      redirects,
      /^\s*\/\*\s+\/index\.html\s+200/m,
      "_redirects must not contain a /* /index.html 200 SPA catch-all rule — it intercepts Next.js API route requests and returns HTML 404",
    );

    // Any splat redirect to an HTML file (e.g. /* /404.html 200) is
    // similarly dangerous for a Next.js + @netlify/plugin-nextjs deployment.
    assert.doesNotMatch(
      redirects,
      /^\s*\/\*\s+\/\S+\.html\s+200/m,
      "_redirects must not contain a /* /*.html 200 catch-all — it intercepts Next.js API route requests",
    );
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
});
