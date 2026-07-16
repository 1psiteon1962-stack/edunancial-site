import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { bulkReview, createUploadBatch, exportBatch, exportBatchToGithub, getUploadBatch } from "@/lib/admin-content/service";
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
});
