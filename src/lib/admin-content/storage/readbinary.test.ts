import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";

// NOTE: Import ONLY from the storage module, not from service.ts, to avoid the
// `next/headers` dependency chain that prevents service.test.ts and
// storage.test.ts from loading in the Node.js test environment.
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";

const FAKE_URL = "https://fake.supabase.co";
const FAKE_KEY = "service-role-key";
const FAKE_BUCKET = "admin-content";

function makeResponse(status: number, body: unknown, contentType?: string): Response {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const headers: Record<string, string> = contentType ? { "content-type": contentType } : {};
  return new Response(text, { status, headers });
}

// ---------------------------------------------------------------------------
// Regression tests: Supabase 400+NoSuchKey response handling in readBinary
//
// Root cause of the production `NoSuchKey 404` error:
//   Supabase Storage returns HTTP 400 (not 404) with a JSON body containing
//   `{"statusCode":"404","error":"NoSuchKey","message":"Object not found"}` for
//   objects that do not exist in a private bucket.
//
//   The original request() guard was:
//     if (!response.ok && response.status !== 404) throw ...
//
//   For a 400+NoSuchKey response: `!response.ok = true`, `400 !== 404 = true`
//   → the method threw instead of returning, so readBinary never reached its
//   `if (response.status === 404) return null` branch.  The finalize route
//   received a raw error ("Supabase storage request failed: 400 {NoSuchKey}")
//   instead of the expected null "file not found" signal, which then surfaced
//   in production logs as "404 NoSuchKey Object not found".
//
// Fix: parse the response body on non-2xx responses and treat 400+NoSuchKey
// (or any body with statusCode "404") as a synthetic HTTP 404 so readBinary
// can return null gracefully.
// ---------------------------------------------------------------------------

describe("SupabaseObjectStorage readBinary — Supabase 400+NoSuchKey handling", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    process.env.NEXT_PUBLIC_SUPABASE_URL = FAKE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = FAKE_KEY;
    process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = FAKE_BUCKET;
    resetAdminContentStorage();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
    resetAdminContentStorage();
  });

  test("readBinary returns null when Supabase returns HTTP 400 with error NoSuchKey", async () => {
    // Regression: Supabase Storage returns 400+NoSuchKey for missing private objects.
    // readBinary must return null (not throw) so callers can handle
    // "file not found" without crashing the finalize route.
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/")) {
        return makeResponse(400, { statusCode: "404", error: "NoSuchKey", message: "Object not found" });
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const result = await storage.readBinary("uploads/courses/batch-1/upload-1-file.zip");
    assert.equal(result, null, "readBinary must return null for 400+NoSuchKey instead of throwing");
  });

  test("readBinary returns null when Supabase returns HTTP 400 with statusCode '404'", async () => {
    // Some Supabase proxy versions return 400 with statusCode "404" in the body
    // even when the error field does not say "NoSuchKey".
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/")) {
        return makeResponse(400, { statusCode: "404", error: "Object not found", message: "Object not found" });
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const result = await storage.readBinary("uploads/courses/batch-1/upload-1-file.zip");
    assert.equal(result, null, "readBinary must return null for 400+statusCode 404 instead of throwing");
  });

  test("readBinary still throws on genuine HTTP 400 errors (not NoSuchKey)", async () => {
    // A genuine authorization or validation failure must still propagate as an error.
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/")) {
        return makeResponse(400, { statusCode: "400", error: "Forbidden", message: "Not authorized" });
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await assert.rejects(
      () => storage.readBinary("uploads/courses/batch-1/upload-1-file.zip"),
      /Supabase storage request failed: 400/,
      "readBinary must still throw on genuine 400 errors",
    );
  });

  test("readBinary returns null when Supabase returns HTTP 404", async () => {
    // Standard HTTP 404 (non-Supabase-wrapped) must also return null.
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/")) {
        return makeResponse(404, "Not found");
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const result = await storage.readBinary("uploads/courses/batch-1/upload-1-file.zip");
    assert.equal(result, null, "readBinary must return null for HTTP 404");
  });

  test("readBinary returns buffer when Supabase returns HTTP 200", async () => {
    const fileContent = "ZIP file bytes here";
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/")) {
        return new Response(fileContent, { status: 200 });
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const result = await storage.readBinary("uploads/courses/batch-1/upload-1-file.zip");
    assert.ok(result !== null, "readBinary must return a buffer when object exists");
    assert.equal(result.toString(), fileContent);
  });
});
