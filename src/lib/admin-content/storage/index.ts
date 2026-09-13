import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getStore } from "@netlify/blobs";

import type { AdminContentStorage } from "@/lib/admin-content/storage/types";
import type { AuditEvent, BatchSummary, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

const LOCAL_ROOT = join(process.cwd(), ".admin-content-store");
const INDEX_FILE = "index.json";
const AUDIT_FILE = "audit.json";
const NETLIFY_STORE = "edunancial-admin-content";

function ensureLocalRoot() { mkdirSync(LOCAL_ROOT, { recursive: true }); }
function localPath(...parts: string[]) { ensureLocalRoot(); return join(LOCAL_ROOT, ...parts); }
function readJsonFile<T>(path: string, fallback: T): T { return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) as T : fallback; }
function writeJsonFile(path: string, data: unknown) { const parent = dirname(path); if (parent) mkdirSync(parent, { recursive: true }); writeFileSync(path, JSON.stringify(data, null, 2)); }
function summarizeBatch(batch: UploadBatch): BatchSummary { return { id: batch.id, name: batch.name, slug: batch.slug, source: batch.source, status: batch.status, createdAt: batch.createdAt, updatedAt: batch.updatedAt, totalUploads: batch.uploads.length, totalFiles: batch.files.length, approvedFiles: batch.files.filter((f) => f.reviewStatus === "approved").length, rejectedFiles: batch.files.filter((f) => f.reviewStatus === "rejected").length, pendingFiles: batch.files.filter((f) => f.reviewStatus === "pending").length, conflicts: batch.files.filter((f) => f.conflictStatus !== "none").length }; }
function listLocalWorkspaceEntries() { if (!existsSync(LOCAL_ROOT)) return [] as string[]; return readdirSync(LOCAL_ROOT, { recursive: true }).map(String).filter((entry) => { try { return statSync(join(LOCAL_ROOT, entry)).isFile(); } catch { return false; } }).map((entry) => entry.replaceAll("\\", "/")); }

class LocalAdminContentStorage implements AdminContentStorage {
  async createBatch(batch: UploadBatch) { await this.updateBatch(batch); return batch; }
  async updateBatch(batch: UploadBatch) { writeJsonFile(localPath("batches", `${batch.id}.json`), batch); const current = readJsonFile<BatchSummary[]>(localPath(INDEX_FILE), []); const next = current.filter((e) => e.id !== batch.id); next.unshift(summarizeBatch(batch)); writeJsonFile(localPath(INDEX_FILE), next); return batch; }
  async removeBatch(batchId: string) { await this.deleteBinary(`batches/${batchId}.json`); }
  async updateBatchIndex(summaries: BatchSummary[]) { writeJsonFile(localPath(INDEX_FILE), summaries); }
  async listBatches() { return readJsonFile<BatchSummary[]>(localPath(INDEX_FILE), []); }
  async getBatch(batchId: string) { return readJsonFile<UploadBatch | null>(localPath("batches", `${batchId}.json`), null); }
  async saveBinary(path: string, content: Buffer, _contentType: string) { const target = localPath(path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, content); }
  async deleteBinary(path: string) { rmSync(localPath(path), { force: true }); }
  async readBinary(path: string) { const target = localPath(path); return existsSync(target) ? readFileSync(target) : null; }
  async appendAuditEvent(event: AuditEvent) { const current = readJsonFile<AuditEvent[]>(localPath(AUDIT_FILE), []); current.unshift(event); writeJsonFile(localPath(AUDIT_FILE), current.slice(0, 1000)); }
  async listAuditHistory(batchId?: string) { const all = readJsonFile<AuditEvent[]>(localPath(AUDIT_FILE), []); return batchId ? all.filter((e) => e.batchId === batchId) : all; }
  async createExport(exportPackage: ExportPackage, archive: Buffer) { await this.saveBinary(exportPackage.storagePath, archive, "application/zip"); writeJsonFile(localPath("exports", `${exportPackage.id}.json`), exportPackage); return exportPackage; }
  async getSignedUploadUrl(_path: string): Promise<string | null> { return null; }
  async listWorkspaceEntries() { return listLocalWorkspaceEntries(); }
}

class NetlifyBlobAdminContentStorage implements AdminContentStorage {
  private get store() { return getStore(NETLIFY_STORE); }
  private async readJson<T>(key: string, fallback: T): Promise<T> { const value = await this.store.get(key, { type: "json", consistency: "strong" }); return value === null ? fallback : value as T; }
  private async writeJson(key: string, value: unknown) { await this.store.setJSON(key, value); }
  async createBatch(batch: UploadBatch) { await this.updateBatch(batch); return batch; }
  async updateBatch(batch: UploadBatch) { await this.writeJson(`batches/${batch.id}.json`, batch); const current = await this.readJson<BatchSummary[]>(INDEX_FILE, []); const next = current.filter((e) => e.id !== batch.id); next.unshift(summarizeBatch(batch)); await this.writeJson(INDEX_FILE, next); return batch; }
  async removeBatch(batchId: string) { await this.store.delete(`batches/${batchId}.json`); }
  async updateBatchIndex(summaries: BatchSummary[]) { await this.writeJson(INDEX_FILE, summaries); }
  async listBatches() { return this.readJson<BatchSummary[]>(INDEX_FILE, []); }
  async getBatch(batchId: string) { return this.readJson<UploadBatch | null>(`batches/${batchId}.json`, null); }
  async saveBinary(path: string, content: Buffer, contentType: string) { await this.store.set(path, new Uint8Array(content), { metadata: { contentType } }); }
  async deleteBinary(path: string) { await this.store.delete(path); }
  async readBinary(path: string) { const value = await this.store.get(path, { type: "arrayBuffer", consistency: "strong" }); return value === null ? null : Buffer.from(value); }
  async appendAuditEvent(event: AuditEvent) { const current = await this.readJson<AuditEvent[]>(AUDIT_FILE, []); current.unshift(event); await this.writeJson(AUDIT_FILE, current.slice(0, 1000)); }
  async listAuditHistory(batchId?: string) { const all = await this.readJson<AuditEvent[]>(AUDIT_FILE, []); return batchId ? all.filter((e) => e.batchId === batchId) : all; }
  async createExport(exportPackage: ExportPackage, archive: Buffer) { await this.saveBinary(exportPackage.storagePath, archive, "application/zip"); await this.writeJson(`exports/${exportPackage.id}.json`, exportPackage); return exportPackage; }
  async getSignedUploadUrl(_path: string): Promise<string | null> { return null; }
  async listWorkspaceEntries() { const result = await this.store.list(); return result.blobs.map((blob) => blob.key); }
}

let cachedStorage: AdminContentStorage | null = null;
export function getAdminContentStorage(): AdminContentStorage {
  if (cachedStorage) return cachedStorage;
  cachedStorage = process.env.NODE_ENV === "production" ? new NetlifyBlobAdminContentStorage() : new LocalAdminContentStorage();
  return cachedStorage;
}
export function getLocalAdminStorageFiles() { return existsSync(LOCAL_ROOT) ? readdirSync(LOCAL_ROOT, { recursive: true }) : []; }
export function resetAdminContentStorage() { cachedStorage = null; rmSync(LOCAL_ROOT, { recursive: true, force: true }); }
