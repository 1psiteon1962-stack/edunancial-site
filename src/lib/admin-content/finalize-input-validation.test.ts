import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { validateFinalizeBody } from "@/lib/admin-content/finalize-input-validation";

const goodUpload = {
  uploadId: "upload_123",
  originalFilename: "RED-L1-es-Caribbean.zip",
  mimeType: "application/zip",
  storagePath: "incoming/upload_123.zip",
  sizeBytes: 1234,
};
const good = () => ({ batchId: "batch_123", uploads: [{ ...goodUpload }] });

describe("Q3 non-retryable finalize input validation", () => {
  test("rejects null, primitives, and arrays before reading properties", () => {
    for (const body of [null, undefined, 0, true, "", "hello", [], [good()]]) {
      const result = validateFinalizeBody(body);
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.error, /JSON object/);
    }
  });

  test("rejects absent, blank, and nonstring batch IDs", () => {
    for (const batchId of [undefined, null, "", "   ", 5, {}, ["batch"]]) {
      const result = validateFinalizeBody({ ...good(), batchId });
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.error, /batchId is required/);
    }
  });

  test("rejects zero, multiple, and non-array uploads", () => {
    for (const uploads of [null, undefined, {}, [], [goodUpload, goodUpload]]) {
      const result = validateFinalizeBody({ batchId: "batch_123", uploads });
      assert.equal(result.ok, false);
      if (!result.ok) assert.match(result.error, /exactly one stored package/);
    }
  });

  test("rejects invalid stored file metadata, including zero-length ZIPs", () => {
    for (const patch of [
      { uploadId: "" },
      { storagePath: null },
      { originalFilename: "" },
      { mimeType: 123 },
      { sizeBytes: 0 },
      { sizeBytes: -1 },
      { sizeBytes: "1234" },
      { sizeBytes: Number.NaN },
      { sizeBytes: Number.POSITIVE_INFINITY },
    ]) {
      const result = validateFinalizeBody({ ...good(), uploads: [{ ...goodUpload, ...patch }] });
      assert.equal(result.ok, false, JSON.stringify(patch));
      if (!result.ok) assert.match(result.error, /metadata is invalid/);
    }
  });

  test("returns one validated upload and trimmed batch ID without changing input", () => {
    const input = { ...good(), batchId: " batch_123 ", destination: "courses" };
    const result = validateFinalizeBody(input);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.body.batchId, "batch_123");
    assert.equal(result.body.destination, "courses");
    assert.deepEqual(result.body.uploads, [goodUpload]);
    assert.equal(input.batchId, " batch_123 ");
  });
});
