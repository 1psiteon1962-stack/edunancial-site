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

beforeEach(() => {
  process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = "12345678901234567890123456789012";
  originalState = existsSync(STATE_PATH) ? readFileSync(STATE_PATH, "utf8") : null;
  rmSync(STATE_PATH, { force: true });
});

afterEach(() => {
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

test("curriculum translation export route requires admin auth", async () => {
  const response = await exportTranslationsRoute(
    new Request("https://example.com/api/admin/curriculum/translations/export"),
  );

  assert.equal(response.status, 401);
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
      "prefix must be a track code or track-level prefix such as RED or RED-L1",
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
  ]);
});
