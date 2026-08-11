import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";

import { GET as exportTranslationsRoute } from "@/app/api/admin/curriculum/translations/export/route";
import { createSignedSessionValue } from "@/lib/admin-content/auth";
import { ADMIN_CSRF_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/admin-content/config";

const STORE_ROOT = join(process.cwd(), ".admin-content-store");
const STATE_PATH = join(STORE_ROOT, "published", "curriculum-state.json");

let originalState: string | null = null;
const originalExportToken = process.env.CURRICULUM_EXPORT_ADMIN_TOKEN;

beforeEach(() => {
  process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = "12345678901234567890123456789012";
  delete process.env.CURRICULUM_EXPORT_ADMIN_TOKEN;
  originalState = existsSync(STATE_PATH) ? readFileSync(STATE_PATH, "utf8") : null;
  rmSync(STATE_PATH, { force: true });
});

afterEach(() => {
  if (originalExportToken === undefined) {
    delete process.env.CURRICULUM_EXPORT_ADMIN_TOKEN;
  } else {
    process.env.CURRICULUM_EXPORT_ADMIN_TOKEN = originalExportToken;
  }
  if (originalState === null) {
    rmSync(STATE_PATH, { force: true });
  } else {
    mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
    writeFileSync(STATE_PATH, originalState, "utf8");
  }
});

function signedHeaders() {
  const signed = createSignedSessionValue({
    email: "owner@example.com",
    csrfToken: "csrf-token",
    expiresAt: Date.now() + 60_000,
    role: "admin",
  });

  return {
    cookie: `${ADMIN_SESSION_COOKIE}=${signed}; ${ADMIN_CSRF_COOKIE}=csrf-token`,
  };
}

function writeSharedState() {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(buildSharedState(), null, 2), "utf8");
}

test("curriculum translation export route requires admin auth", async () => {
  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export"),
  );

  assert.equal(response.status, 401);
});

test("curriculum translation export route still accepts existing admin session auth", async () => {
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export?lessonId=RED-L1-001", {
      headers: signedHeaders(),
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{
    id: "RED-L1-001",
    title: "Red L1 lesson",
    summary: "Red L1 summary",
    body: "Red L1 body",
  }]);
});

test("curriculum translation export route rejects incorrect bearer tokens", async () => {
  process.env.CURRICULUM_EXPORT_ADMIN_TOKEN = "expected-export-token";
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export?lessonId=RED-L1-001", {
      headers: { authorization: ["Bearer", "wrong-export-token"].join(" ") },
    }),
  );

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Unauthorized" });
});

test("curriculum translation export route accepts valid bearer tokens", async () => {
  process.env.CURRICULUM_EXPORT_ADMIN_TOKEN = "expected-export-token";
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export?lessonId=RED-L1-001", {
      headers: { authorization: ["Bearer", "expected-export-token"].join(" ") },
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{
    id: "RED-L1-001",
    title: "Red L1 lesson",
    summary: "Red L1 summary",
    body: "Red L1 body",
  }]);
});

test("curriculum translation export route does not authorize bearer tokens when env is unset", async () => {
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export?lessonId=RED-L1-001", {
      headers: { authorization: ["Bearer", "expected-export-token"].join(" ") },
    }),
  );

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Unauthorized" });
});

test("curriculum translation export route validates prefix and lessonId query params", async () => {
  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export?prefix=RED-L0&lessonId=bad-id", {
      headers: signedHeaders(),
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Invalid curriculum translation export query",
    errors: [
      "prefix must be a track code, track-level prefix, or level prefix such as RED, RED-L1, or L1",
      "lessonId must use canonical lesson format such as RED-L1-001",
    ],
  });
});

test("curriculum translation export route returns stored English fields and intersects filters", async () => {
  mkdirSync(join(STORE_ROOT, "published"), { recursive: true });
  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        schemaVersion: "1.0",
        initialized: true,
        updatedAt: new Date().toISOString(),
        lessons: {
          "RED-L1-002": {
            id: "RED-L1-002",
            track: "RED",
            trackName: "Real Estate",
            level: 1,
            lessonNumber: 2,
            title: "Second lesson",
            summary: "Second summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L1/RED-L1-002.md",
            body: "Second body",
            frontMatter: {},
            translations: {
              es: {
                title: "Segunda lección",
                summary: "Segundo resumen",
                body: "Segundo cuerpo",
              },
            },
          },
          "RED-L1-001": {
            id: "RED-L1-001",
            track: "RED",
            trackName: "Real Estate",
            level: 1,
            lessonNumber: 1,
            title: "First lesson",
            summary: "First summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/RED/L1/RED-L1-001.md",
            body: "First body",
            frontMatter: {},
          },
          "BLUE-L1-001": {
            id: "BLUE-L1-001",
            track: "BLUE",
            trackName: "Business",
            level: 1,
            lessonNumber: 1,
            title: "Blue lesson",
            summary: "Blue summary",
            author: "Edunancial Faculty",
            date: "2026-08-05",
            version: "1.0",
            status: "active",
            importedAt: new Date().toISOString(),
            metadata: {},
            path: "content/curriculum/BLUE/L1/BLUE-L1-001.md",
            body: "Blue body",
            frontMatter: {},
          },
        },
        batchLessonIds: {},
      },
      null,
      2,
    ),
    "utf8",
  );

  const response = await exportTranslationsRoute(
    new Request(
      "https://example.com/api/admin/curriculum/translations/export?prefix=RED-L1&lessonId=RED-L1-002&lessonId=BLUE-L1-001",
      { headers: signedHeaders() },
    ),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [
    {
      id: "RED-L1-002",
      title: "Second lesson",
      summary: "Second summary",
      body: "Second body",
    },
    {
      id: "BLUE-L1-001",
      title: null,
      summary: null,
      body: null,
    },
  ]);
});

function buildSharedState() {
  return {
    schemaVersion: "1.0",
    initialized: true,
    updatedAt: new Date().toISOString(),
    lessons: {
      "RED-L1-001": {
        id: "RED-L1-001", track: "RED", trackName: "Real Estate", level: 1, lessonNumber: 1,
        title: "Red L1 lesson", summary: "Red L1 summary", author: "Edunancial Faculty",
        date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(),
        metadata: {}, path: "content/curriculum/RED/L1/RED-L1-001.md", body: "Red L1 body", frontMatter: {},
      },
      "BLUE-L1-001": {
        id: "BLUE-L1-001", track: "BLUE", trackName: "Business", level: 1, lessonNumber: 1,
        title: "Blue L1 lesson", summary: "Blue L1 summary", author: "Edunancial Faculty",
        date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(),
        metadata: {}, path: "content/curriculum/BLUE/L1/BLUE-L1-001.md", body: "Blue L1 body", frontMatter: {},
      },
      "RED-L2-001": {
        id: "RED-L2-001", track: "RED", trackName: "Real Estate", level: 2, lessonNumber: 1,
        title: "Red L2 lesson", summary: "Red L2 summary", author: "Edunancial Faculty",
        date: "2026-08-05", version: "1.0", status: "active", importedAt: new Date().toISOString(),
        metadata: {}, path: "content/curriculum/RED/L2/RED-L2-001.md", body: "Red L2 body", frontMatter: {},
      },
    },
    batchLessonIds: {},
  };
}

test("curriculum translation export route matches level-only prefix L1 across all tracks", async () => {
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request(
      "https://example.com/api/admin/curriculum/translations/export?prefix=L1",
      { headers: signedHeaders() },
    ),
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  const ids = body.map((r: { id: string }) => r.id);
  assert.ok(ids.includes("RED-L1-001"), "should include RED-L1-001");
  assert.ok(ids.includes("BLUE-L1-001"), "should include BLUE-L1-001");
  assert.ok(!ids.includes("RED-L2-001"), "should not include RED-L2-001");
});

test("curriculum translation export route matches comma-separated prefixes", async () => {
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request(
      "https://example.com/api/admin/curriculum/translations/export?prefix=RED-L1,BLUE-L1",
      { headers: signedHeaders() },
    ),
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  const ids = body.map((r: { id: string }) => r.id);
  assert.ok(ids.includes("RED-L1-001"), "should include RED-L1-001");
  assert.ok(ids.includes("BLUE-L1-001"), "should include BLUE-L1-001");
  assert.ok(!ids.includes("RED-L2-001"), "should not include RED-L2-001");
});

test("curriculum translation export route returns null placeholders for missing lessonIds", async () => {
  writeSharedState();

  const response = await exportTranslationsRoute(
    new Request(
      "https://example.com/api/admin/curriculum/translations/export?lessonId=RED-L1-001&lessonId=RED-L1-099",
      { headers: signedHeaders() },
    ),
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  const found = body.find((r: { id: string }) => r.id === "RED-L1-001");
  const missing = body.find((r: { id: string }) => r.id === "RED-L1-099");
  assert.ok(found, "should include RED-L1-001");
  assert.equal(found.title, "Red L1 lesson");
  assert.ok(missing, "should include placeholder for RED-L1-099");
  assert.equal(missing.title, null);
  assert.equal(missing.summary, null);
  assert.equal(missing.body, null);
});
