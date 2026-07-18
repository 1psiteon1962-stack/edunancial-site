import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";

type EnvSnapshot = {
  NODE_ENV?: string;
  EDUNANCIAL_UPLOAD_STORAGE_KEY?: string;
  EDUNANCIAL_UPLOAD_STORAGE_BUCKET?: string;
  SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

function snapshotEnv(): EnvSnapshot {
  return {
    NODE_ENV: process.env.NODE_ENV,
    EDUNANCIAL_UPLOAD_STORAGE_KEY: process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY,
    EDUNANCIAL_UPLOAD_STORAGE_BUCKET: process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function restoreEnv(snapshot: EnvSnapshot) {
  for (const key of Object.keys(snapshot) as Array<keyof EnvSnapshot>) {
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  resetAdminContentStorage();
});

describe("admin-content storage configuration", () => {
  test("supports server-side Supabase URL and bucket alias in production", () => {
    const env = snapshotEnv();
    try {
      process.env.NODE_ENV = "production";
      delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
      process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = "admin-content";
      process.env.SUPABASE_URL = "https://example.supabase.co";
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

      assert.doesNotThrow(() => getAdminContentStorage());
    } finally {
      restoreEnv(env);
    }
  });

  test("throws a clear production error when required storage env vars are missing", () => {
    const env = snapshotEnv();
    try {
      process.env.NODE_ENV = "production";
      delete process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY;
      delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
      delete process.env.SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      assert.throws(() => getAdminContentStorage(), /EDUNANCIAL_UPLOAD_STORAGE_KEY/);
    } finally {
      restoreEnv(env);
    }
  });
});
