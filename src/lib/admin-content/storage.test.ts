import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { getAdminContentStorage, resetAdminContentStorage, resolveAdminContentStorageEnv } from "@/lib/admin-content/storage";

const env = process.env as Record<string, string | undefined>;
const originalFetch = global.fetch;
const originalNodeEnv = process.env.NODE_ENV;
const originalBucket = process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
const originalBucketAlias = process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
const originalPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

afterEach(() => {
  global.fetch = originalFetch;
  restoreEnv("NODE_ENV", originalNodeEnv);
  restoreEnv("EDUNANCIAL_UPLOAD_STORAGE_KEY", originalBucket);
  restoreEnv("EDUNANCIAL_UPLOAD_STORAGE_BUCKET", originalBucketAlias);
  restoreEnv("NEXT_PUBLIC_SUPABASE_URL", originalPublicSupabaseUrl);
  restoreEnv("SUPABASE_URL", originalSupabaseUrl);
  restoreEnv("SUPABASE_SERVICE_ROLE_KEY", originalSupabaseKey);
  resetAdminContentStorage();
});

describe("admin-content storage env resolution", () => {
  test("uses the default bucket and SUPABASE_URL alias when production credentials are present", async () => {
    env.NODE_ENV = "production";
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    env.SUPABASE_URL = "https://example.supabase.co";
    env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const calls: Array<{ url: string; headers: Headers }> = [];
    global.fetch = async (input, init) => {
      calls.push({ url: String(input), headers: new Headers(init?.headers) });
      return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
    };

    const config = resolveAdminContentStorageEnv();
    assert.equal(config.bucket, "admin-content");
    assert.equal(config.url, "https://example.supabase.co");
    assert.equal(config.key, "service-role-key");

    const batches = await getAdminContentStorage().listBatches();
    assert.deepEqual(batches, []);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://example.supabase.co/storage/v1/object/admin-content/admin-content/index.json");
    assert.ok(calls[0].headers.has("authorization"));
    assert.ok(calls[0].headers.has("apikey"));
  });

  test("accepts the explicit bucket alias", () => {
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
    env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = "custom-bucket";

    const config = resolveAdminContentStorageEnv();
    assert.equal(config.bucket, "custom-bucket");
  });

  test("throws in production when Supabase credentials are missing", () => {
    env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    assert.throws(
      () => getAdminContentStorage(),
      /Configure production admin content storage with SUPABASE_SERVICE_ROLE_KEY plus NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL/,
    );
  });
});
