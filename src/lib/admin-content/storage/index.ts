import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { DEFAULT_STORAGE_PREFIX } from "@/lib/admin-content/config";
import { prepareAdminUploadStorageRuntime } from "@/lib/admin-content/storage/runtime";
import type { AdminContentStorage } from "@/lib/admin-content/storage/types";
import type { AuditEvent, BatchSummary, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

const LOCAL_ROOT = join(process.cwd(), ".admin-content-store");
const INDEX_FILE = "index.json";
const AUDIT_FILE = "audit.json";

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

class SupabaseObjectStorage implements AdminContentStorage {
  private bucketVerified = false;
  constructor(private readonly bucket: string, private readonly prefix: string) {}
  private get baseUrl() { const runtime = prepareAdminUploadStorageRuntime(); const key = runtime.serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ""; if (!runtime.supabaseUrl || !key) throw new Error("Supabase storage is not configured."); return { url: runtime.supabaseUrl, key }; }
  private objectPath(path: string) { return `${this.prefix}/${path}`; }
  private static assertSafePath(path: string) { if (!/^[a-zA-Z0-9/\-_.]+$/.test(path)) throw new Error(`Unsafe storage path rejected: ${path}`); }
  private async ensureBucketExists() {
    if (this.bucketVerified) return;
    const runtime = prepareAdminUploadStorageRuntime();

    // Bucket management is an administrative operation and must never run with
    // an anon key. Production upload routes already require the service-role
    // key before reaching storage. In tests/development, anon-only object reads
    // may still proceed without attempting bucket creation.
    if (!runtime.serviceRoleKey) return;

    const key = runtime.serviceRoleKey;
    const read = await fetch(`${runtime.supabaseUrl}/storage/v1/bucket/${encodeURIComponent(this.bucket)}`, { method: "GET", headers: { Authorization: "Bearer " + key, apikey: key }, cache: "no-store" });
    const contentType = read.headers.get("content-type") ?? "";
    if (contentType.toLowerCase().includes("text/html")) throw new Error("NEXT_PUBLIC_SUPABASE_URL appears to be misconfigured or is the wrong Supabase URL: bucket check returned HTML instead of JSON from the Supabase Storage API.");
    if (read.ok) { this.bucketVerified = true; return; }
    const bodyText = await read.text();
    let missing = read.status === 404;
    try { const body = JSON.parse(bodyText) as { statusCode?: string | number; error?: string; message?: string }; missing = missing || String(body.statusCode ?? "") === "404" || body.error === "Bucket not found" || (body.message ?? "").toLowerCase().includes("bucket not found"); } catch {}
    if (!missing) throw new Error(`Supabase bucket check failed: ${read.status} ${bodyText}`);
    const created = await fetch(`${runtime.supabaseUrl}/storage/v1/bucket`, { method: "POST", headers: { Authorization: "Bearer " + runtime.serviceRoleKey, apikey: runtime.serviceRoleKey, "content-type": "application/json" }, body: JSON.stringify({ id: this.bucket, name: this.bucket, public: false }), cache: "no-store" });
    if (!created.ok) { const text = await created.text(); if (!/already exists|duplicate/i.test(text)) throw new Error(`Supabase bucket setup failed: ${created.status} ${text}`); }
    this.bucketVerified = true;
  }
  private async request(path: string, init: RequestInit = {}) {
    const { url, key } = this.baseUrl; SupabaseObjectStorage.assertSafePath(path); await this.ensureBucketExists();
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(`${url}/storage/v1/object/${this.bucket}/${encodedPath}`, { ...init, headers: { Authorization: "Bearer " + key, apikey: key, "x-upsert": "true", ...(init.headers ?? {}) }, cache: "no-store" });
    if (!response.ok && response.status !== 404) { let bodyText = ""; try { bodyText = await response.text(); const body = JSON.parse(bodyText) as { statusCode?: string | number; error?: string }; if (String(body.statusCode) === "404" || body.error === "NoSuchKey") return new Response(bodyText, { status: 404, headers: { "content-type": "application/json" } }); } catch {} throw new Error(`Supabase storage request failed: ${response.status} ${bodyText}`); }
    return response;
  }
  private async listPrefix(prefix: string) { const { url, key } = this.baseUrl; await this.ensureBucketExists(); const response = await fetch(`${url}/storage/v1/object/list/${this.bucket}`, { method: "POST", headers: { Authorization: "Bearer " + key, apikey: key, "content-type": "application/json" }, body: JSON.stringify({ prefix: this.objectPath(prefix), limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }), cache: "no-store" }); if (!response.ok) throw new Error(`Supabase storage list failed: ${response.status} ${await response.text().catch(() => "")}`); return await response.json() as Array<{ name: string; id?: string | null; metadata?: Record<string, unknown> | null }>; }
  private async readJson<T>(path: string, fallback: T) { const response = await this.request(this.objectPath(path)); return response.status === 404 ? fallback : await response.json() as T; }
  private async writeJson(path: string, value: unknown) { await this.request(this.objectPath(path), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value) }); }
  async createBatch(batch: UploadBatch) { await this.updateBatch(batch); return batch; }
  async updateBatch(batch: UploadBatch) { await this.writeJson(`batches/${batch.id}.json`, batch); const current = await this.readJson<BatchSummary[]>(INDEX_FILE, []); const next = current.filter((e) => e.id !== batch.id); next.unshift(summarizeBatch(batch)); await this.writeJson(INDEX_FILE, next); return batch; }
  async removeBatch(batchId: string) { await this.deleteBinary(`batches/${batchId}.json`); }
  async updateBatchIndex(summaries: BatchSummary[]) { await this.writeJson(INDEX_FILE, summaries); }
  async listBatches() { return this.readJson<BatchSummary[]>(INDEX_FILE, []); }
  async getBatch(batchId: string) { return this.readJson<UploadBatch | null>(`batches/${batchId}.json`, null); }
  async saveBinary(path: string, content: Buffer, contentType: string) { await this.request(this.objectPath(path), { method: "POST", headers: { "content-type": contentType }, body: new Uint8Array(content) }); }
  async readBinary(path: string) { const response = await this.request(this.objectPath(path)); return response.status === 404 ? null : Buffer.from(await response.arrayBuffer()); }
  async deleteBinary(path: string) { await this.request(this.objectPath(path), { method: "DELETE" }); }
  async appendAuditEvent(event: AuditEvent) { const current = await this.readJson<AuditEvent[]>(AUDIT_FILE, []); current.unshift(event); await this.writeJson(AUDIT_FILE, current.slice(0, 1000)); }
  async listAuditHistory(batchId?: string) { const all = await this.readJson<AuditEvent[]>(AUDIT_FILE, []); return batchId ? all.filter((e) => e.batchId === batchId) : all; }
  async createExport(exportPackage: ExportPackage, archive: Buffer) { await this.saveBinary(exportPackage.storagePath, archive, "application/zip"); await this.writeJson(`exports/${exportPackage.id}.json`, exportPackage); return exportPackage; }
  async getSignedUploadUrl(path: string): Promise<string | null> {
    const runtime = prepareAdminUploadStorageRuntime();
    if (!runtime.serviceRoleKey) return null;
    await this.ensureBucketExists();
    const objectPath = this.objectPath(path); SupabaseObjectStorage.assertSafePath(objectPath); const encoded = objectPath.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(`${runtime.supabaseUrl}/storage/v1/object/sign/upload/${this.bucket}/${encoded}`, { method: "POST", headers: { Authorization: "Bearer " + runtime.serviceRoleKey, apikey: runtime.serviceRoleKey }, cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json() as { signedURL?: string };
    const signedPath = data.signedURL?.trim();
    if (!signedPath) return null;
    if (/^https?:\/\//i.test(signedPath)) return signedPath; if (signedPath.startsWith("/storage/v1/")) return `${runtime.supabaseUrl}${signedPath}`; if (signedPath.startsWith("storage/v1/")) return `${runtime.supabaseUrl}/${signedPath}`; if (signedPath.startsWith("/")) return `${runtime.supabaseUrl}/storage/v1${signedPath}`; return `${runtime.supabaseUrl}/storage/v1/${signedPath}`;
  }
  async listWorkspaceEntries() { const queue = [""]; const files: string[] = []; const visited = new Set<string>(); while (queue.length) { const prefix = queue.shift() ?? ""; if (visited.has(prefix)) continue; visited.add(prefix); const entries = await this.listPrefix(prefix); for (const entry of entries) { if (!entry?.name) continue; const nextPath = `${prefix}${entry.name}`; const isFolder = !entry.id && !entry.metadata; if (isFolder) queue.push(`${nextPath}/`); else files.push(nextPath.replaceAll("\\", "/")); } } return files; }
}

let cachedStorage: AdminContentStorage | null = null;
export function getAdminContentStorage(): AdminContentStorage {
  if (cachedStorage) return cachedStorage;
  if (process.env.NODE_ENV === "production") {
    const runtime = prepareAdminUploadStorageRuntime();
    cachedStorage = new SupabaseObjectStorage(runtime.bucket, DEFAULT_STORAGE_PREFIX);
    return cachedStorage;
  }
  const runtime = prepareAdminUploadStorageRuntime();
  const key = runtime.serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  if (runtime.supabaseUrl && key) { cachedStorage = new SupabaseObjectStorage(runtime.bucket, DEFAULT_STORAGE_PREFIX); return cachedStorage; }
  cachedStorage = new LocalAdminContentStorage(); return cachedStorage;
}
export function getLocalAdminStorageFiles() { return existsSync(LOCAL_ROOT) ? readdirSync(LOCAL_ROOT, { recursive: true }) : []; }
export function resetAdminContentStorage() { cachedStorage = null; rmSync(LOCAL_ROOT, { recursive: true, force: true }); }
