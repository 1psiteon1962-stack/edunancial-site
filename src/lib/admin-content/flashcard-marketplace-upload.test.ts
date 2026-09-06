import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { ALLOWED_EXTENSIONS, EXTENSION_TO_MIME } from "@/lib/admin-content/config";
import { MARKETPLACE_CATEGORIES as SHARED_MARKETPLACE_CATEGORIES } from "@/lib/admin-content/constants";
import { MARKETPLACE_CATEGORIES, parseUploadConfig } from "@/lib/admin-content/upload-intake";

describe("flashcard marketplace upload support", () => {
  test("allows XLSX entries carried inside flashcard ZIP packages", () => {
    assert.equal(ALLOWED_EXTENSIONS.has(".xlsx"), true);
    assert.ok(EXTENSION_TO_MIME[".xlsx"]?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
  });

  test("exposes and accepts the flashcards marketplace category", () => {
    assert.ok(SHARED_MARKETPLACE_CATEGORIES.includes("flashcards"));
    assert.ok(MARKETPLACE_CATEGORIES.includes("flashcards"));

    const form = new FormData();
    form.set("contentDestination", "marketplace");
    form.set("title", "Edunancial Flashcards");
    form.set("description", "Flashcard master package");
    form.set("language", "en-US");
    form.set("membershipAccess", "basic");
    form.set("publicationStatus", "draft");
    form.set("marketplaceCategory", "flashcards");

    const config = parseUploadConfig(form);
    assert.equal(config.destination, "marketplace");
    if (config.destination === "marketplace") assert.equal(config.category, "flashcards");
  });
});
