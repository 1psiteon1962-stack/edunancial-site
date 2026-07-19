import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { appendGlobalAuditEventSafely } from "@/lib/admin-content/audit";
import { resetAdminContentStorage } from "@/lib/admin-content/storage";

describe("admin-content audit", () => {
  test("does not throw when production audit storage is unavailable", async () => {
    const env = process.env as Record<string, string | undefined>;
    const originalNodeEnv = process.env.NODE_ENV;
    const originalBucketName = process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
    const originalBucket = process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
    const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    env.NODE_ENV = "production";
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    resetAdminContentStorage();

    try {
      const appended = await appendGlobalAuditEventSafely({
        id: "audit_test",
        timestamp: new Date().toISOString(),
        action: "login-success",
        result: "success",
        actor: "owner@example.com",
        metadata: { role: "owner" },
      });

      assert.equal(appended, false);
    } finally {
      env.NODE_ENV = originalNodeEnv;
      if (originalBucket === undefined) {
        delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
      } else {
        process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY = originalBucket;
      }
      if (originalBucketName === undefined) {
        delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
      } else {
        process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = originalBucketName;
      }
      if (originalSupabaseUrl === undefined) {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      } else {
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
      }
      if (originalSupabaseKey === undefined) {
        delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      } else {
        process.env.SUPABASE_SERVICE_ROLE_KEY = originalSupabaseKey;
      }
      resetAdminContentStorage();
    }
  });
});
