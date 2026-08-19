import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { extractAuthoritativePublishedLessonIds } from "@/lib/admin-content/published-canonical";

describe("authoritative published curriculum identities", () => {
  test("accepts only active canonical lesson identities", () => {
    const ids = extractAuthoritativePublishedLessonIds(JSON.stringify({
      lessons: {
        "GREEN-L1-001": { status: "active" },
        legacy: { id: "purple-l1-050", status: "active" },
        "ORANGE-L1-002": { status: "inactive" },
        invalid: { id: "not-a-canonical-id", status: "active" },
      },
    }));

    assert.deepEqual([...ids].sort(), ["GREEN-L1-001", "PURPLE-L1-050"]);
  });

  test("returns an empty set for malformed published state", () => {
    assert.equal(extractAuthoritativePublishedLessonIds("not-json").size, 0);
  });
});
