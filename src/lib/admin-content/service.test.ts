import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { bulkReview, createUploadBatch, exportBatch, exportBatchToGithub, getUploadBatch, publishBatch } from "@/lib/admin-content/service";
import { resetAdminContentStorage } from "@/lib/admin-content/storage";

afterEach(() => {
  resetAdminContentStorage();
  delete process.env.EDUNANCIAL_GITHUB_TOKEN;
  delete process.env.EDUNANCIAL_GITHUB_OWNER;
  delete process.env.EDUNANCIAL_GITHUB_REPO;
});

function makeRequest() {
  return new Request("https://example.com/api/admin/content/upload", { method: "POST", headers: { origin: "https://example.com", host: "example.com" } });
}

function makeFormData() {
  const formData = new FormData();
  formData.set("batchName", "Claude batch");
  formData.set("source", "Claude");
  formData.set("notes", "Generated from tests");
  formData.set("contentDestination", "courses");
  formData.set("courseTrack", "red");
  formData.set("courseLevel", "level-1");
  formData.set("language", "en");
  formData.set("membershipAccess", "basic");
  formData.set("publicationStatus", "draft");
  formData.set("title", "Generated course");
  formData.set("description", "Generated from tests");
  return formData;
}

function makeZip(entries: Array<{ name: string; content: string }>) {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  const u16 = (value: number) => { const b = Buffer.alloc(2); b.writeUInt16LE(value, 0); return b; };
  const u32 = (value: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(value >>> 0, 0); return b; };
  for (const entry of entries) {
    const data = Buffer.from(entry.content);
    const name = Buffer.from(entry.name);
    const local = Buffer.concat([Buffer.from([0x50,0x4b,0x03,0x04]),u16(20),u16(0),u16(0),u16(0),u16(0),u32(0),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);
    const dir = Buffer.concat([Buffer.from([0x50,0x4b,0x01,0x02]),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(0),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);
    chunks.push(local); central.push(dir); offset += local.length;
  }
  const cd = Buffer.concat(central);
  return Buffer.concat([...chunks, cd, Buffer.from([0x50,0x4b,0x05,0x06]), u16(0), u16(0), u16(entries.length), u16(entries.length), u32(cd.length), u32(offset), u16(0)]);
}

/** Simulates an actual Edunancial course ZIP with multiple lessons, assets, and metadata */
function makeEdunancialCourseZip() {
  return makeZip([
    {
      name: "course.json",
      content: JSON.stringify({
        title: "Real Estate Foundations",
        slug: "real-estate-foundations",
        path: "red",
        level: "level-1",
        language: "en",
        region: "north-america",
        membershipTier: "basic",
        modules: [
          {
            title: "Module 1: Introduction",
            lessons: [
              { title: "Lesson 1: What is Real Estate?", file: "lessons/lesson-01.md" },
              { title: "Lesson 2: Types of Property",   file: "lessons/lesson-02.md" },
            ],
          },
        ],
      }),
    },
    {
      name: "lessons/lesson-01.md",
      content: [
        "---",
        "id: RED-L1-001",
        "track: RED",
        "level: 1",
        "lessonNumber: 1",
        "title: What is Real Estate?",
        "---",
        "",
        "## Learning Objectives",
        "",
        "- Understand what real estate means",
        "- Identify different property types",
        "",
        "## Core Content",
        "",
        "Real estate refers to land and any permanent structures attached to it.",
      ].join("\n"),
    },
    {
      name: "lessons/lesson-02.md",
      content: [
        "---",
        "id: RED-L1-002",
        "track: RED",
        "level: 1",
        "lessonNumber: 2",
        "title: Types of Property",
        "---",
        "",
        "## Learning Objectives",
        "",
        "- Know residential vs commercial property",
        "",
        "## Core Content",
        "",
        "Residential property is used for housing. Commercial property is used for business.",
      ].join("\n"),
    },
    {
      name: "media/thumbnail.jpg",
      content: "\xff\xd8\xff\xe0placeholder-jpg",
    },
    {
      name: "media/worksheet-lesson-01.pdf",
      content: "%PDF-1.4 placeholder worksheet",
    },
    {
      name: "README.md",
      content: "# Real Estate Foundations\n\nEdunancial Red Academy – Level 1 course package.",
    },
  ]);
}

describe("admin-content upload service", () => {
  test("creates a valid multi-file upload batch", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("## Learning Objectives\n\nCurso de bienes raices")], "real-estate-level-1-lesson-es.md", { type: "text/markdown" }));
    formData.append("files", new File([Buffer.from('{"course":"stocks"}')], "stocks-course.json", { type: "application/json" }));

    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    assert.equal(batch.uploads.length, 2);
    assert.equal(batch.files.length, 2);
    assert.equal(batch.files[0].metadata.uploadBatchId, batch.id);
  });

  test("extracts zip uploads and flags duplicates across batches", async () => {
    const first = makeFormData();
    first.append("files", new File([Buffer.from("lesson one")], "lesson.txt", { type: "text/plain" }));
    const firstBatch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, first);
    assert.equal(firstBatch.files[0].duplicateStatus, "new");

    const second = makeFormData();
    second.append("files", new File([makeZip([{ name: "lesson.txt", content: "lesson one" }])], "lesson-bundle.zip", { type: "application/zip" }));
    const secondBatch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, second);
    assert.equal(secondBatch.files[0].duplicateStatus, "exact-duplicate");
  });

  test("supports approve and export workflow and surfaces github config failures", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("## Learning Objectives\n\n## Core Content\n\nBusiness lesson")], "business-level-1-lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    await bulkReview(batch.id, { email: "owner@example.com" }, [batch.files[0].id], "approved");

    const updated = await getUploadBatch(batch.id);
    assert(updated);
    const exportPackage = await exportBatch(batch.id, { email: "owner@example.com" });
    assert.match(exportPackage.fileName, /approved-content\.zip$/);

    await assert.rejects(() => exportBatchToGithub(batch.id, { email: "owner@example.com" }), /GitHub integration requires/);
  });

  test("full Edunancial production content workflow: upload ZIP → validate → extract → review → assign → approve → publish", async () => {
    // Step 1: Upload ZIP (once)
    const formData = makeFormData();
    formData.set("batchName", "Real Estate Foundations – Level 1");
    formData.set("courseTrack", "red");
    formData.set("courseLevel", "level-1");
    formData.set("language", "en");
    formData.set("title", "Real Estate Foundations");
    formData.set("description", "Edunancial Red Academy Level 1 – North America");
    formData.append("files", new File([makeEdunancialCourseZip()], "real-estate-foundations.zip", { type: "application/zip" }));

    // Step 2 & 3: System validates and extracts automatically
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    assert.equal(batch.uploads.length, 1, "one ZIP uploaded");
    assert(batch.files.length >= 5, "all files extracted from ZIP");

    // Verify extraction produced expected file types
    const filenames = batch.files.map((f) => f.normalizedFilename);
    assert(filenames.some((n) => n.endsWith(".json")), "course.json extracted");
    assert(filenames.some((n) => n.endsWith(".md")), "markdown lessons extracted");
    assert(filenames.some((n) => n.endsWith(".pdf")), "PDF worksheet extracted");
    assert(filenames.some((n) => n.endsWith(".jpg") || n.endsWith(".jpeg")), "image extracted");

    // Step 4: Files presented for review (all start as pending)
    assert(batch.files.every((f) => f.reviewStatus === "pending"), "all files pending review");

    // Step 5: Assign Academy, Level, Color, Language, Region per file
    for (const file of batch.files) {
      assert(file.classification.pillar === "red", `pillar is red for ${file.normalizedFilename}`);
      assert(file.classification.academyLevel === "level-1", `level is level-1 for ${file.normalizedFilename}`);
      assert(file.classification.language === "en", `language is en for ${file.normalizedFilename}`);
    }

    // Step 6: Storage destinations set automatically
    for (const file of batch.files) {
      assert(file.metadata.intendedDestination.startsWith("content/courses/red/level-1/en/"), `destination correct for ${file.normalizedFilename}`);
    }

    // Step 7: Approve files (review gate – nothing published yet)
    const allFileIds = batch.files.map((f) => f.id);
    const reviewed = await bulkReview(batch.id, { email: "owner@example.com" }, allFileIds, "approved");
    assert(reviewed.files.every((f) => f.reviewStatus === "approved"), "all files approved");

    // Step 8: Publish requires GitHub config; verify error is surfaced correctly
    await assert.rejects(
      () => publishBatch(batch.id, { email: "owner@example.com" }),
      /GitHub integration requires/,
      "publish correctly surfaces missing GitHub config error",
    );

    // Verify audit trail includes batch-created, archive-extracted, bulk-action events
    const actions = batch.auditHistory.map((e) => e.action);
    assert(actions.includes("batch-created"), "audit: batch-created");
    assert(actions.includes("archive-extracted"), "audit: archive-extracted");
  });

  test("publishBatch rejects when no files are approved", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson content")], "lesson.txt", { type: "text/plain" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    await assert.rejects(
      () => publishBatch(batch.id, { email: "owner@example.com" }),
      /No approved files to publish/,
    );
  });
});
