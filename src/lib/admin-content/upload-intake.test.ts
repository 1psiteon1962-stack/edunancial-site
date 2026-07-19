import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { buildIntendedDestination, parseUploadConfig } from "@/lib/admin-content/upload-intake";

describe("admin-content upload intake", () => {
  test("requires destination selection", () => {
    const formData = new FormData();
    formData.set("title", "Title");
    formData.set("description", "Description");
    assert.throws(() => parseUploadConfig(formData), /Content destination is required/);
  });

  test("parses required course upload fields", () => {
    const formData = new FormData();
    formData.set("contentDestination", "courses");
    formData.set("title", "Real Estate Foundations");
    formData.set("description", "Course description");
    formData.set("language", "en");
    formData.set("membershipAccess", "basic");
    formData.set("publicationStatus", "published");
    formData.set("courseTrack", "red");
    formData.set("courseLevel", "level-3");
    const config = parseUploadConfig(formData);
    assert.equal(config.destination, "courses");
    assert.equal(config.track, "red");
    assert.equal(config.level, "level-3");
  });

  test("parses required marketplace upload fields", () => {
    const formData = new FormData();
    formData.set("contentDestination", "marketplace");
    formData.set("title", "Tax worksheet");
    formData.set("description", "Worksheet description");
    formData.set("language", "es");
    formData.set("membershipAccess", "free");
    formData.set("publicationStatus", "draft");
    formData.set("marketplaceCategory", "worksheets");
    const config = parseUploadConfig(formData);
    assert.equal(config.destination, "marketplace");
    assert.equal(config.category, "worksheets");
  });

  test("routes courses and marketplace to isolated destinations", () => {
    const coursePath = buildIntendedDestination(
      {
        destination: "courses",
        track: "blue",
        level: "level-4",
        language: "en",
        membershipAccess: "elite",
        publicationStatus: "published",
        title: "Business Scaling",
        description: "Description",
        previewUrl: null,
        thumbnailUrl: null,
      },
      "course.pdf",
      "upload_abc12345",
    );
    const marketplacePath = buildIntendedDestination(
      {
        destination: "marketplace",
        category: "ebooks",
        language: "en",
        membershipAccess: "basic",
        publicationStatus: "published",
        title: "Business eBook",
        description: "Description",
        associatedLevel: null,
        associatedTrack: null,
        previewUrl: null,
        thumbnailUrl: null,
      },
      "ebook.pdf",
      "upload_def12345",
    );
    assert.match(coursePath, /^content\/courses\//);
    assert.doesNotMatch(coursePath, /^content\/marketplace\//);
    assert.match(marketplacePath, /^content\/marketplace\//);
    assert.doesNotMatch(marketplacePath, /^content\/courses\//);
  });
});
