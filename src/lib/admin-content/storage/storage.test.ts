import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";

import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";

const FAKE_URL = "https://fake.supabase.co";
const FAKE_KEY = "service-role-key";
const FAKE_BUCKET = "admin-content";

function makeResponse(status: number, body: unknown): Response {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(text, { status });
}

describe("SupabaseObjectStorage ensureBucketExists", () => {
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

  test("creates bucket when GET returns HTTP 404", async () => {
    const calls: string[] = [];
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      calls.push(url);
      if (url.includes("/storage/v1/bucket/") && !url.endsWith("/bucket")) {
        return makeResponse(404, { statusCode: "404", error: "Bucket not found", message: "Bucket not found" });
      }
      if (url.includes("/storage/v1/bucket") && !url.includes(`/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { name: FAKE_BUCKET });
      }
      // Subsequent object requests
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await storage.listBatches();

    assert.ok(calls.some((u) => u.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)), "should GET bucket");
    assert.ok(calls.some((u) => u.includes("/storage/v1/bucket") && !u.includes(`/${FAKE_BUCKET}`)), "should POST to create bucket");
  });

  test("creates bucket when GET returns HTTP 400 with body statusCode '404'", async () => {
    const calls: string[] = [];
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      calls.push(url);
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        // Supabase proxy returns 400 with a body whose statusCode is the string "404"
        return makeResponse(400, { statusCode: "404", error: "Bucket not found", message: "Bucket not found" });
      }
      if (url.includes("/storage/v1/bucket")) {
        return makeResponse(200, { name: FAKE_BUCKET });
      }
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await storage.listBatches(); // should not throw

    assert.ok(calls.some((u) => u.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)), "should GET bucket");
    assert.ok(calls.some((u) => u.endsWith("/storage/v1/bucket")), "should POST to create bucket");
  });

  test("throws when GET returns an unexpected error status", async () => {
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(403, "Forbidden");
      }
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await assert.rejects(
      () => storage.listBatches(),
      /Supabase bucket check failed: 403/,
    );
  });

  test("throws when GET returns 400 with non-404 body statusCode", async () => {
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(400, { statusCode: "400", error: "Bad Request", message: "Invalid bucket name" });
      }
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await assert.rejects(
      () => storage.listBatches(),
      /Supabase bucket check failed: 400/,
    );
  });

  test("skips bucket management and proceeds when only anon key is available", async () => {
    // Simulate the production failure scenario: no SUPABASE_SERVICE_ROLE_KEY,
    // only the anon key.  The server must NOT attempt bucket creation (which
    // would fail with an RLS 403) and must proceed to the actual storage call.
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    resetAdminContentStorage();

    const calls: string[] = [];
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      calls.push(url);
      // Object read returns an empty list.
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const batches = await storage.listBatches();

    assert.ok(
      calls.every((u) => !u.includes("/storage/v1/bucket")),
      "must not touch the bucket management endpoint when no service-role key is set",
    );
    assert.deepEqual(batches, [], "should return empty list");

    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    resetAdminContentStorage();
  });

  test("skips bucket creation when bucket already exists (GET returns 200)", async () => {
    const calls: string[] = [];
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      calls.push(url);
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET });
      }
      return makeResponse(200, "[]");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await storage.listBatches();

    assert.ok(calls.some((u) => u.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)), "should GET bucket");
    assert.ok(
      !calls.some((u) => u.endsWith("/storage/v1/bucket")),
      "must not POST to create an already-existing bucket",
    );
  });
});
