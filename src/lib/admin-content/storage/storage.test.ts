import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";

import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";
import { createUploadBatchFromStoredFiles } from "@/lib/admin-content/service";

const FAKE_URL = "https://fake.supabase.co";
const FAKE_KEY = "service-role-key";
const FAKE_BUCKET = "admin-content";

function makeResponse(status: number, body: unknown, contentType?: string): Response {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const headers: Record<string, string> = contentType ? { "content-type": contentType } : {};
  return new Response(text, { status, headers });
}

function makeHtmlResponse(status: number): Response {
  return makeResponse(
    status,
    "<!DOCTYPE html><html><head><title>Not Found</title></head><body>404 Not Found</body></html>",
    "text/html; charset=utf-8",
  );
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

describe("SupabaseObjectStorage getSignedUploadUrl", () => {
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

  async function getSignedUploadUrlForResponse(signedURL: string | undefined) {
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      // Bucket existence check
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { name: FAKE_BUCKET });
      }
      // Signed upload URL creation
      if (url.includes("/storage/v1/object/sign/upload/")) {
        return makeResponse(200, signedURL === undefined ? {} : { signedURL });
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    return storage.getSignedUploadUrl("uploads/courses/batch-1/upload-1-file.md");
  }

  test("returns full signed upload URL when service role key is present", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("/storage/v1/object/upload/sign/fake-token-abc");
    assert.equal(signedUrl, FAKE_URL + "/storage/v1/object/upload/sign/fake-token-abc");
  });

  test("normalizes signed URL with leading slash and no storage prefix", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://fake.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
  });

  test("normalizes signed URL with no leading slash and no storage prefix", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://fake.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
  });

  test("preserves signed URL with leading slash and storage prefix", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://fake.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
    assert.equal(signedUrl?.match(/\/storage\/v1/g)?.length, 1);
  });

  test("normalizes signed URL with storage prefix and no leading slash", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://fake.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
    assert.equal(signedUrl?.match(/\/storage\/v1/g)?.length, 1);
  });

  test("returns absolute signed upload URL unchanged", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("https://example.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://example.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
  });

  test("returns null when signedURL is missing", async () => {
    const signedUrl = await getSignedUploadUrlForResponse(undefined);
    assert.equal(signedUrl, null);
  });

  test("returns null when signedURL is empty", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("");
    assert.equal(signedUrl, null);
  });

  test("returns null when signedURL is whitespace only", async () => {
    const signedUrl = await getSignedUploadUrlForResponse("   ");
    assert.equal(signedUrl, null);
  });

  test("normalizes signed URL without double slash when base URL has trailing slash", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://fake.supabase.co/";
    resetAdminContentStorage();

    const signedUrl = await getSignedUploadUrlForResponse("/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc");
    assert.equal(
      signedUrl,
      "https://fake.supabase.co/storage/v1/object/upload/sign/admin-content/uploads/test-file.pdf?token=abc",
    );
    assert.equal(signedUrl?.startsWith("https://fake.supabase.co//"), false);
  });

  test("returns null when service role key is absent", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    resetAdminContentStorage();
    // Re-set with only anon key so storage initialises as Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    const storage = getAdminContentStorage();
    const signedUrl = await storage.getSignedUploadUrl("uploads/courses/batch-1/upload-1-file.md");
    assert.equal(signedUrl, null);

    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  test("returns null when Supabase returns a non-OK response", async () => {
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { name: FAKE_BUCKET });
      }
      if (url.includes("/storage/v1/object/sign/upload/")) {
        return makeResponse(403, "Forbidden");
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const signedUrl = await storage.getSignedUploadUrl("uploads/courses/batch-1/upload-1-file.md");
    assert.equal(signedUrl, null);
  });
});

describe("createUploadBatchFromStoredFiles", () => {
  afterEach(() => {
    resetAdminContentStorage();
  });

  function makeRequest() {
    return new Request("https://example.com/api/admin/content/upload/finalize", {
      method: "POST",
      headers: { origin: "https://example.com", host: "example.com" },
    });
  }

  test("processes pre-uploaded markdown file from local storage", async () => {
    const content = Buffer.from("## Learning Objectives\n\nCourse content here");
    const uploadId = "upload-test-001";
    const storagePath = "uploads/courses/batch-123/upload-test-001-lesson.md";

    // Pre-write the file to local storage so readBinary can find it.
    const { default: LocalStorage } = await import("node:fs");
    const path = await import("node:path");
    const cwd = process.cwd();
    const localRoot = path.join(cwd, ".admin-content-store");
    const filePath = path.join(localRoot, storagePath);
    LocalStorage.mkdirSync(path.dirname(filePath), { recursive: true });
    LocalStorage.writeFileSync(filePath, content);

    const batch = await createUploadBatchFromStoredFiles(makeRequest(), { email: "owner@example.com" }, {
      batchId: "batch-123",
      batchName: "Test batch",
      source: "test",
      notes: "",
      uploadConfig: {
        destination: "courses",
        track: "red",
        level: "level-1",
        language: "en",
        membershipAccess: "basic",
        publicationStatus: "draft",
        title: "Test Course",
        description: "Test description",
      },
      uploads: [
        {
          uploadId,
          originalFilename: "lesson.md",
          mimeType: "text/markdown",
          sizeBytes: content.length,
          storagePath,
        },
      ],
    });

    assert.equal(batch.id, "batch-123");
    assert.equal(batch.uploads.length, 1);
    assert.equal(batch.files.length, 1);
    assert.equal(batch.files[0].metadata.title, "Test Course");
  });

  test("records a warning when a file is not found in storage after upload", async () => {
    const batch = await createUploadBatchFromStoredFiles(makeRequest(), { email: "owner@example.com" }, {
      batchId: "batch-missing",
      batchName: "Missing file batch",
      source: "test",
      notes: "",
      uploadConfig: {
        destination: "marketplace",
        category: "books",
        language: "en",
        membershipAccess: "free",
        publicationStatus: "draft",
        title: "Missing Book",
        description: "desc",
      },
      uploads: [
        {
          uploadId: "upload-missing",
          originalFilename: "missing.pdf",
          mimeType: "application/pdf",
          sizeBytes: 1000,
          storagePath: "uploads/marketplace/batch-missing/upload-missing-missing.pdf",
        },
      ],
    });
    // The file is not in storage; the error is surfaced as a batch warning rather
    // than a thrown exception so other successfully uploaded files can still be processed.
    assert.equal(batch.warnings.length, 1);
    assert.match(batch.warnings[0], /File not found in storage after upload/);
    assert.equal(batch.uploads.length, 0);
  });
});

// ---------------------------------------------------------------------------
// Regression tests: storage path prefix alignment
//
// storage.readBinary(storagePath) → request(objectPath(storagePath))
//                                 → fetch({supabase}/object/{bucket}/PREFIX/storagePath)
//
// The presign route produces storagePath values that the finalize route reads
// back via storage.readBinary(storagePath).  The two paths MUST stay in sync.
// ---------------------------------------------------------------------------
describe("storage path prefix alignment", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    process.env.NEXT_PUBLIC_SUPABASE_URL = FAKE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = FAKE_BUCKET;
    // No service-role key → getSignedUploadUrl returns null.
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    resetAdminContentStorage();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET;
    resetAdminContentStorage();
  });

  test("readBinary uses DEFAULT_STORAGE_PREFIX in its Supabase URL", async () => {
    // Verify that SupabaseObjectStorage.readBinary() prefixes the object path
    // with DEFAULT_STORAGE_PREFIX.  This ensures finalize can read files that
    // were written using the same prefix by signed-URL uploads or server-proxied
    // uploads.
    const capturedUrls: string[] = [];
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      capturedUrls.push(input.toString());
      return makeResponse(404, "");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    const storagePath = "uploads/courses/batch-1/upload-1-file.zip";
    await storage.readBinary(storagePath);

    // The fetched URL must contain DEFAULT_STORAGE_PREFIX/storagePath
    const readUrl = capturedUrls.find((u) => u.includes("/storage/v1/object/"));
    assert.ok(readUrl, "should have made a storage fetch");
    assert.ok(
      readUrl!.includes(`/storage/v1/object/${FAKE_BUCKET}/admin-content/${storagePath}`),
      `readBinary URL should include prefix 'admin-content/${storagePath}', got: ${readUrl}`,
    );
  });

  test("presign route does not expose anon-key credentials for direct browser upload", () => {
    // Security regression: the presign route must NOT construct a directUpload
    // spec that includes the anon key, because browser uploads authenticated
    // only with the anon key are subject to Supabase RLS and fail with
    // HTTP 400 / "new row violates row-level security policy" when no explicit
    // INSERT policy exists for the anon role.
    //
    // The correct fallback is to return directUpload: null so the upload client
    // falls through to the server-proxied legacy endpoint, which uses the
    // service-role key and bypasses RLS.
    const { readFileSync } = require("node:fs");
    const path = require("node:path");
    const routeSrc = readFileSync(
      path.join(process.cwd(), "src/app/api/admin/content/upload/presign/route.ts"),
      "utf8",
    ) as string;

    assert.ok(
      !routeSrc.includes('"Bearer " + anonKey'),
      "presign/route.ts must not construct anon-key Authorization headers for a directUpload spec",
    );
    assert.ok(
      routeSrc.includes("directUpload: null"),
      "presign/route.ts must always return directUpload: null (anon-key direct upload removed)",
    );
  });
})

// ---------------------------------------------------------------------------
// Regression tests: HTML-response detection prevents wrong-host 404
//
// Root cause of "Direct upload failed (HTTP 404): <!DOCTYPE html>...":
//   When NEXT_PUBLIC_SUPABASE_URL is misconfigured to the Netlify site URL,
//   the bucket connectivity check fetches a URL on the Netlify app.  A
//   Next.js catch-all page returns HTTP 200 with Content-Type: text/html.
//   Previously the check only looked at status == 404, so the 200 HTML
//   passed silently.  The presign route then returned a directUpload.url
//   pointing at the Netlify app, and the browser's XHR received HTML 404.
//
//   Fix: also throw when the bucket check response has Content-Type: text/html.
// ---------------------------------------------------------------------------

describe("SupabaseObjectStorage ensureBucketExists — HTML response detection", () => {
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

  test("throws with a clear message when bucket GET returns HTTP 200 with text/html (wrong Supabase URL)", async () => {
    // Simulates NEXT_PUBLIC_SUPABASE_URL pointing at the Netlify site:
    // the catch-all page returns HTTP 200 with Content-Type: text/html.
    // Without the HTML check this would have passed as "bucket exists" and
    // getSignedUploadUrl() would silently return null, causing the presign
    // route to construct a directUpload URL that also points at the Netlify
    // site — resulting in "Direct upload failed (HTTP 404): <!DOCTYPE html>".
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeHtmlResponse(200);
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await assert.rejects(
      () => storage.listBatches(),
      /NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured.*HTML instead of JSON/i,
      "must reject with a clear message when bucket check returns HTML — indicates wrong Supabase URL",
    );
  });

  test("throws with a clear message when bucket GET returns HTTP 404 with text/html", async () => {
    // Simulates NEXT_PUBLIC_SUPABASE_URL pointing at a host that returns
    // HTML 404 for unknown paths (the original production failure signature).
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeHtmlResponse(404);
      }
      return makeResponse(200, "{}");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    await assert.rejects(
      () => storage.listBatches(),
      /NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured.*HTML instead of JSON/i,
      "must reject with a clear message when bucket check returns HTML 404",
    );
  });

  test("does NOT throw when bucket GET returns HTTP 200 with application/json (correct Supabase URL)", async () => {
    // Normal happy-path: Supabase returns JSON for a valid bucket.
    globalThis.fetch = mock.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes(`/storage/v1/bucket/${FAKE_BUCKET}`)) {
        return makeResponse(200, { id: FAKE_BUCKET, name: FAKE_BUCKET }, "application/json");
      }
      return makeResponse(200, "[]", "application/json");
    }) as typeof globalThis.fetch;

    const storage = getAdminContentStorage();
    // Should not throw — bucket exists and returns valid JSON.
    const batches = await storage.listBatches();
    assert.deepEqual(batches, []);
  });
})
