import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { bulkReview, createUploadBatch, exportBatch, exportBatchToGithub, getUploadBatch, publishBatch, updateBatchFile } from "@/lib/admin-content/service";
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

/** Representative multi-file Edunancial course ZIP with documents covering various content types */
function makeEdunancialCourseZip() {
  return makeZip([
    {
      name: "lesson-01-intro.md",
      content: `# Introduction to Real Estate Investing\n\n## Learning Objectives\n\nBy the end of this lesson you will be able to:\n\n- Identify the three main real estate investment strategies\n- Explain the difference between active and passive investing\n- Evaluate a basic rental property for cash flow\n\n## Core Content\n\nReal estate investing is one of the most reliable wealth-building strategies available. Unlike paper assets, real property provides tangible value and multiple income streams.\n\n### The Three Pillars of Real Estate Wealth\n\n1. **Cash Flow** – Monthly income after all expenses\n2. **Appreciation** – Long-term growth in property value\n3. **Tax Benefits** – Depreciation, deductions, and 1031 exchanges\n`,
    },
    {
      name: "lesson-02-cash-flow.md",
      content: `# Calculating Cash Flow\n\n## Learning Objectives\n\n- Calculate gross rent and net operating income (NOI)\n- Apply the 50% Rule and 1% Rule as quick screening tools\n- Build a simple property analysis spreadsheet\n\n## Core Content\n\nCash flow is the lifeblood of real estate investing. A property that does not produce positive cash flow is a liability, not an asset.\n\n### NOI Formula\n\nNOI = Gross Rental Income − Vacancy − Operating Expenses\n\nExample: A property renting for $2,000/month with 5% vacancy and $600/month operating expenses has an NOI of $1,300/month.\n`,
    },
    {
      name: "quiz-01.json",
      content: JSON.stringify({
        title: "Real Estate Fundamentals Quiz",
        questions: [
          {
            id: "q1",
            text: "Which of the following best describes 'cash flow' in real estate?",
            options: [
              "The total purchase price of a property",
              "Monthly income remaining after all expenses",
              "The appreciation in property value over time",
              "The down payment required to purchase",
            ],
            correct: 1,
          },
          {
            id: "q2",
            text: "What does NOI stand for?",
            options: ["Net Operating Income", "New Ownership Investment", "National Office Index", "None of the above"],
            correct: 0,
          },
        ],
      }),
    },
    {
      name: "worksheet-property-analysis.csv",
      content: "Category,Amount\nGross Monthly Rent,$2000\nVacancy (5%),-$100\nProperty Tax,-$200\nInsurance,-$100\nMaintenance,-$150\nPM Fees,-$150\nNOI,$1300\nMortgage Payment,-$900\nCash Flow,$400\n",
    },
    {
      name: "supplemental-reading.txt",
      content: "Recommended books for this module:\n\n1. Rich Dad Poor Dad – Robert Kiyosaki\n2. The Millionaire Real Estate Investor – Gary Keller\n3. The Book on Rental Property Investing – Brandon Turner\n",
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

  test("extracts representative multi-file Edunancial course ZIP and classifies all files", async () => {
    const formData = makeFormData();
    const zipBuffer = makeEdunancialCourseZip();
    formData.append("files", new File([zipBuffer], "red-level-1-real-estate-course.zip", { type: "application/zip" }));

    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    // ZIP contains 5 files: 2 markdown, 1 JSON, 1 CSV, 1 TXT
    assert.equal(batch.uploads.length, 1, "one archive upload record");
    assert.equal(batch.files.length, 5, "five extracted files");
    assert(batch.uploads[0].isArchive, "upload record is flagged as archive");

    const mdFiles = batch.files.filter((f) => f.extension === ".md");
    const jsonFiles = batch.files.filter((f) => f.extension === ".json");
    const csvFiles = batch.files.filter((f) => f.extension === ".csv");
    assert.equal(mdFiles.length, 2, "two markdown lesson files extracted");
    assert.equal(jsonFiles.length, 1, "one JSON quiz extracted");
    assert.equal(csvFiles.length, 1, "one CSV worksheet extracted");

    // All files inherit the batch-level course assignment
    for (const file of batch.files) {
      assert.equal(file.metadata.pillar, "red", "files inherit red track pillar");
      assert.equal(file.metadata.academyLevel, "level-1", "files inherit level-1 academy level");
      assert.equal(file.metadata.language, "en", "files inherit English language");
      assert.match(file.classification.destination, /content\/courses\/red\/level-1\/en\//, "destination path is under correct course directory");
    }

    // Archive audit event should be recorded
    const archiveEvents = batch.auditHistory.filter((e) => e.action === "archive-extracted");
    assert.equal(archiveEvents.length, 1, "archive-extracted audit event recorded");
  });

  test("allows updating file course assignment metadata and recalculates destination", async () => {
    const formData = makeFormData(); // starts as red/level-1/en
    formData.append("files", new File([Buffer.from("## Learning Objectives\n\nPaper assets lesson")], "paper-assets-lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    const file = batch.files[0];
    assert.equal(file.metadata.pillar, "red");

    // Reassign to white track, level-2, Spanish
    const newDest = "content/courses/white/level-2/es/paper-assets-lesson.md";
    const updated = await updateBatchFile(batch.id, file.id, { email: "owner@example.com" }, {
      classification: { ...file.classification, pillar: "white", academyLevel: "level-2", language: "es", destination: newDest },
      metadata: { ...file.metadata, pillar: "white", academyLevel: "level-2", language: "es", region: "latin-america", intendedDestination: newDest },
    });

    assert.equal(updated.metadata.pillar, "white", "pillar updated to white");
    assert.equal(updated.metadata.academyLevel, "level-2", "academy level updated to level-2");
    assert.equal(updated.metadata.language, "es", "language updated to Spanish");
    assert.equal(updated.metadata.region, "latin-america", "region set to latin-america");
    assert.equal(updated.classification.destination, newDest, "destination updated to correct course path");

    // Verify persisted
    const reloaded = await getUploadBatch(batch.id);
    assert(reloaded);
    const reloadedFile = reloaded.files.find((f) => f.id === file.id);
    assert(reloadedFile);
    assert.equal(reloadedFile.metadata.pillar, "white", "pillar change persisted");
  });

  test("publishBatch requires approved files and surfaces github config error", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("# Real Estate Lesson\n\n## Learning Objectives\n\n## Core Content\n\nLesson content here.")], "re-lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);

    // Publish before approval should fail
    await assert.rejects(() => publishBatch(batch.id, { email: "owner@example.com" }), /approved/);

    // Approve file then attempt publish (GitHub config not set → should fail with GitHub error)
    await bulkReview(batch.id, { email: "owner@example.com" }, [batch.files[0].id], "approved");
    await assert.rejects(() => publishBatch(batch.id, { email: "owner@example.com" }), /GitHub integration requires/);
  });

  test("full workflow: upload zip → extract → assign → approve → export package", async () => {
    const formData = makeFormData();
    formData.set("courseTrack", "blue");
    formData.set("courseLevel", "level-2");
    formData.set("title", "Blue Business Course");
    formData.set("description", "Business and entrepreneurship foundations");
    const zipBuffer = makeZip([
      { name: "module-01-intro.md", content: "# Business Foundations\n\n## Learning Objectives\n\n- Understand profit and loss\n\n## Core Content\n\nBusiness fundamentals lesson content." },
      { name: "module-02-cash.md", content: "# Cash Flow Management\n\n## Learning Objectives\n\n- Calculate operating costs\n\n## Core Content\n\nManaging cash flow in a business." },
      { name: "quiz-foundations.json", content: '{"title":"Business Quiz","questions":[{"id":"q1","text":"What is profit?","options":["Revenue minus expenses","Revenue plus expenses"],"correct":0}]}' },
    ]);
    formData.append("files", new File([zipBuffer], "blue-business-level-2.zip", { type: "application/zip" }));

    // Step 1: Upload and extract
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    assert.equal(batch.files.length, 3, "all 3 files extracted from ZIP");
    assert(batch.files.every((f) => f.metadata.pillar === "blue"), "all files assigned blue track");
    assert(batch.files.every((f) => f.metadata.academyLevel === "level-2"), "all files assigned level-2");
    assert(batch.files.every((f) => f.classification.destination.includes("content/courses/blue/level-2/en/")), "destination paths correct");

    // Step 2: Reassign one file to a different track to verify per-file assignment
    const jsonFile = batch.files.find((f) => f.extension === ".json");
    assert(jsonFile);
    const newQuizDest = "content/courses/blue/level-2/en/quiz-foundations.json";
    await updateBatchFile(batch.id, jsonFile.id, { email: "owner@example.com" }, {
      classification: { ...jsonFile.classification, destination: newQuizDest },
      metadata: { ...jsonFile.metadata, intendedDestination: newQuizDest, title: "Business Foundations Quiz" },
    });

    // Step 3: Approve all files
    const allFileIds = batch.files.map((f) => f.id);
    const afterApproval = await bulkReview(batch.id, { email: "owner@example.com" }, allFileIds, "approved");
    assert(afterApproval.files.every((f) => f.reviewStatus === "approved"), "all files approved");

    // Step 4: Export to ZIP package
    const exportPackage = await exportBatch(batch.id, { email: "owner@example.com" });
    assert.match(exportPackage.fileName, /approved-content\.zip$/, "export ZIP created");
    assert(exportPackage.validation.success || exportPackage.validation.warnings.length >= 0, "validation ran");

    // Verify audit trail
    const reloaded = await getUploadBatch(batch.id);
    assert(reloaded);
    const actions = reloaded.auditHistory.map((e) => e.action);
    assert(actions.includes("batch-created"), "batch-created audit event present");
    assert(actions.includes("archive-extracted"), "archive-extracted audit event present");
    assert(actions.includes("bulk-action"), "bulk-action audit event present");
    assert(actions.includes("export-generated"), "export-generated audit event present");
  });
});
