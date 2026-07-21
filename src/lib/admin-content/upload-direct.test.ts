import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { createDirectUploadSpec } from "@/lib/admin-content/upload-direct";

describe("admin-content upload direct fallback spec", () => {
  test("builds a Supabase object upload URL with method and prefixed storage path", () => {
    const spec = createDirectUploadSpec(
      "https://fake.supabase.co/",
      "anon-key",
      "admin-content",
      "uploads/courses/batch-1/upload-1-lesson.zip",
    );

    assert.equal(
      spec.url,
      "https://fake.supabase.co/storage/v1/object/admin-content/admin-content/uploads/courses/batch-1/upload-1-lesson.zip",
    );
    assert.equal(spec.method, "POST");
    assert.equal(spec.bucket, "admin-content");
    assert.equal(spec.storagePath, "uploads/courses/batch-1/upload-1-lesson.zip");
    assert.equal(spec.headers.apikey, "anon-key");
    assert.equal(spec.headers["x-upsert"], "true");
    assert.ok("Authorization" in spec.headers);
  });

  test("normalizes trailing slash in supabaseUrl to avoid double-slash", () => {
    const spec = createDirectUploadSpec(
      "https://trailing.supabase.co///",
      "key",
      "bucket",
      "uploads/file.zip",
    );
    assert.ok(
      !spec.url.includes("co///"),
      `URL must not have triple-slash: ${spec.url}`,
    );
    assert.ok(
      !spec.url.includes("co//"),
      `URL must not have double-slash: ${spec.url}`,
    );
    assert.ok(
      spec.url.startsWith("https://trailing.supabase.co/storage/"),
      `URL must start with normalized base: ${spec.url}`,
    );
  });
});
