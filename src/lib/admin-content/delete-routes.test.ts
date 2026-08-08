import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";

import { ADMIN_CSRF_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/admin-content/config";
import { createSignedSessionValue } from "@/lib/admin-content/auth";
import { createUploadBatch } from "@/lib/admin-content/service";
import { resetAdminContentStorage } from "@/lib/admin-content/storage";
import { DELETE as deleteBatchRoute } from "@/app/api/admin/content/batches/[batchId]/route";
import { DELETE as deleteFileRoute } from "@/app/api/admin/content/batches/[batchId]/files/[fileId]/route";
import { POST as clearWorkspaceRoute } from "@/app/api/admin/content/maintenance/clear-workspace/route";

beforeEach(() => {
  process.env.EDUNANCIAL_ADMIN_SESSION_SECRET = "12345678901234567890123456789012";
});

afterEach(() => {
  resetAdminContentStorage();
});

function makeFormData() {
  const formData = new FormData();
  formData.set("batchName", "Route delete batch");
  formData.set("source", "tests");
  formData.set("notes", "delete route tests");
  formData.set("contentDestination", "courses");
  formData.set("courseTrack", "red");
  formData.set("courseLevel", "level-1");
  formData.set("language", "en");
  formData.set("membershipAccess", "basic");
  formData.set("publicationStatus", "draft");
  formData.set("title", "Delete route tests");
  formData.set("description", "Delete route tests");
  return formData;
}

function signedHeaders(overrides?: Record<string, string>) {
  const signed = createSignedSessionValue({
    email: "owner@example.com",
    csrfToken: "csrf-token",
    expiresAt: Date.now() + 60_000,
    role: "admin",
  });
  return {
    cookie: `${ADMIN_SESSION_COOKIE}=${signed}; ${ADMIN_CSRF_COOKIE}=csrf-token`,
    origin: "https://example.com",
    host: "example.com",
    "x-csrf-token": "csrf-token",
    ...overrides,
  };
}

describe("admin-content deletion routes", () => {
  test("rejects unauthorized batch delete", async () => {
    const response = await deleteBatchRoute(new Request("https://example.com/api/admin/content/batches/batch_1", { method: "DELETE" }), {
      params: Promise.resolve({ batchId: "batch_00000000-0000-0000-0000-000000000000" }),
    });
    assert.equal(response.status, 401);
  });

  test("enforces csrf on batch delete", async () => {
    const response = await deleteBatchRoute(
      new Request("https://example.com/api/admin/content/batches/batch_1", {
        method: "DELETE",
        headers: signedHeaders({ origin: "https://malicious.example" }),
        body: JSON.stringify({ allowExported: false }),
      }),
      { params: Promise.resolve({ batchId: "batch_00000000-0000-0000-0000-000000000000" }) },
    );
    assert.equal(response.status, 403);
  });

  test("rejects invalid identifiers", async () => {
    const response = await deleteBatchRoute(
      new Request("https://example.com/api/admin/content/batches/../../oops", {
        method: "DELETE",
        headers: signedHeaders({ "content-type": "application/json" }),
        body: JSON.stringify({ allowExported: false }),
      }),
      { params: Promise.resolve({ batchId: "../../oops" }) },
    );
    assert.equal(response.status, 400);
  });

  test("supports authorized file delete", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson")], "lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(
      new Request("https://example.com/api/admin/content/upload", {
        method: "POST",
        headers: { origin: "https://example.com", host: "example.com" },
      }),
      { email: "owner@example.com" },
      formData,
    );

    const response = await deleteFileRoute(
      new Request(`https://example.com/api/admin/content/batches/${batch.id}/files/${batch.files[0].id}`, {
        method: "DELETE",
        headers: signedHeaders(),
      }),
      { params: Promise.resolve({ batchId: batch.id, fileId: batch.files[0].id }) },
    );
    assert.equal(response.status, 200);
  });

  test("rejects non-admin batch delete", async () => {
    const signed = createSignedSessionValue({
      email: "member@example.com",
      csrfToken: "csrf-token",
      expiresAt: Date.now() + 60_000,
      role: "member" as never,
    });
    const response = await deleteBatchRoute(
      new Request("https://example.com/api/admin/content/batches/batch_1", {
        method: "DELETE",
        headers: {
          cookie: `${ADMIN_SESSION_COOKIE}=${signed}; ${ADMIN_CSRF_COOKIE}=csrf-token`,
          origin: "https://example.com",
          host: "example.com",
          "x-csrf-token": "csrf-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({ allowExported: false }),
      }),
      { params: Promise.resolve({ batchId: "batch_00000000-0000-0000-0000-000000000000" }) },
    );
    assert.equal(response.status, 403);
  });

  test("requires typed confirmation for clear workspace endpoint", async () => {
    const response = await clearWorkspaceRoute(
      new Request("https://example.com/api/admin/content/maintenance/clear-workspace", {
        method: "POST",
        headers: signedHeaders({ "content-type": "application/json" }),
        body: JSON.stringify({ confirmation: "WRONG" }),
      }),
    );
    assert.equal(response.status, 400);
  });
});

describe("deletion route hardening checks", () => {
  function readSource(relativePath: string) {
    return readFileSync(path.join(process.cwd(), relativePath), "utf8");
  }

  test("state-changing deletion routes require admin session with csrf validation", () => {
    const files = [
      "src/app/api/admin/content/batches/[batchId]/route.ts",
      "src/app/api/admin/content/batches/[batchId]/files/[fileId]/route.ts",
      "src/app/api/admin/content/batches/bulk-delete/route.ts",
      "src/app/api/admin/content/batches/[batchId]/files/bulk-delete/route.ts",
      "src/app/api/admin/content/maintenance/delete-failed/route.ts",
      "src/app/api/admin/content/maintenance/clear-workspace/route.ts",
      "src/app/api/admin/content/maintenance/orphans/route.ts",
    ];

    for (const file of files) {
      const src = readSource(file);
      assert.match(src, /requireAdminApiSession\(request,\s*true\)/, `${file} must enforce csrf validation`);
    }
  });
});
