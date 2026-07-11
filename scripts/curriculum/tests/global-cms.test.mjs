import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { createInMemoryCmsEngine } from "../../../src/lib/cms/global-content.js";

const admin = { userId: "admin-1", role: "administrator" };
const editor = { userId: "editor-1", role: "editor" };
const reviewer = { userId: "reviewer-1", role: "reviewer" };

function createPayload() {
  return {
    lessonId: "RED-L1-001",
    track: "RED",
    level: 1,
    lessonNumber: 1,
    title: "Introduction to Real Estate",
    language: "en",
    region: "us",
    references: ["https://example.com/ref"],
    competencyStandards: ["COMP-1"],
    localizations: { en: { title: "Intro" } },
    seo: { keywords: ["real estate"] },
  };
}

describe("global CMS engine", () => {
  test("create lesson", () => {
    const engine = createInMemoryCmsEngine();
    const lesson = engine.createLesson(createPayload(), admin);
    assert.equal(lesson.lessonId, "RED-L1-001");
    assert.equal(lesson.versionNumber, 1);
  });

  test("edit lesson", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    const edited = engine.editLesson("RED-L1-001", { title: "Updated", reasonForChange: "Title update" }, editor);
    assert.equal(edited.title, "Updated");
    assert.equal(edited.versionNumber, 2);
  });

  test("rollback lesson", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    engine.editLesson("RED-L1-001", { title: "Updated" }, editor);
    const rollback = engine.rollbackLesson("RED-L1-001", 1, admin);
    assert.equal(rollback.title, "Introduction to Real Estate");
  });

  test("approve lesson", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    const approved = engine.transitionStatus("RED-L1-001", "approved", reviewer);
    assert.equal(approved.status, "approved");
  });

  test("publish lesson", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    const published = engine.publishLesson("RED-L1-001", admin);
    assert.equal(published.status, "published");
    assert.ok(published.publication.searchIndexedAt);
  });

  test("archive and restore lesson", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    const archived = engine.archiveLesson("RED-L1-001", admin);
    assert.equal(archived.status, "archived");
    const restored = engine.restoreLesson("RED-L1-001", admin);
    assert.equal(restored.status, "draft");
  });

  test("upload media and track usage", () => {
    const engine = createInMemoryCmsEngine();
    engine.uploadMedia({ mediaId: "media-1", type: "image", url: "https://cdn/1.png" }, admin);
    const media = engine.getMedia(admin);
    assert.equal(media.length, 1);
    assert.equal(media[0].isOrphaned, true);
  });

  test("assign reviewer and translator", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    engine.assignRole("RED-L1-001", "reviewer", "reviewer-9", admin);
    const updated = engine.assignRole("RED-L1-001", "translator", "translator-9", admin);
    assert.equal(updated.assignments.reviewer, "reviewer-9");
    assert.equal(updated.assignments.translator, "translator-9");
  });

  test("search by ID and filter by status", () => {
    const engine = createInMemoryCmsEngine();
    engine.createLesson(createPayload(), admin);
    engine.publishLesson("RED-L1-001", admin);

    const foundById = engine.listLessons({ lessonId: "RED-L1-001" }, admin);
    const foundByFilter = engine.listLessons({ filter: "published" }, admin);
    assert.equal(foundById.length, 1);
    assert.equal(foundByFilter.length, 1);
  });

  test("verify permissions", () => {
    const engine = createInMemoryCmsEngine();
    assert.throws(() => engine.createLesson(createPayload(), { userId: "reader", role: "read_only" }));
  });
});
