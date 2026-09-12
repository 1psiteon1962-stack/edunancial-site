import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildPracticeFlashcardDestination, validatePracticeUpload } from "@/lib/practice/flashcard-upload";

const config = {
  destination: "practice" as const,
  contentType: "flashcards" as const,
  track: "blue" as const,
  level: "level-1" as const,
  language: "en-US" as const,
  membershipAccess: "basic" as const,
  title: "Blue Level 1 Flashcards",
  description: "Core Business flashcards included with membership.",
};

describe("Practice flashcard uploads", () => {
  test("validates the canonical Practice configuration", () => {
    assert.equal(validatePracticeUpload(config).destination, "practice");
  });

  test("stores cards outside Marketplace", () => {
    const destination = buildPracticeFlashcardDestination(config, "BLUE-L1-en-US-flashcards.zip");
    assert.match(destination, /^content\/practice\/flashcards\/blue\/level-1\/en_us\//);
    assert.equal(destination.includes("marketplace"), false);
  });
});
