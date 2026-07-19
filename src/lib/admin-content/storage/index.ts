import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { DEFAULT_STORAGE_PREFIX } from "@/lib/admin-content/config";
import type { AdminContentStorage } from "@/lib/admin-content/storage/types";
import type { AuditEvent, BatchSummary, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

const LOCAL_ROOT = join(process.cwd(), ".admin-content-store");
const INDEX_FILE = "index.json";
const AUDIT_FILE = "audit.json";

function ensureLocalRoot() {
  mkdirSync(LOCAL_ROOT, { recursive: true });
}

function localPath(...parts: string[]) {
  ensureLocalRoot();
  return join(LOCAL_ROOT, ...parts);
}

function readJsonFile<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJsonFile(path: string, data: unknown) {
  const parent = dirname(path);
  if (parent) mkdirSync(parent, { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function summarizeBatch(batch: UploadBatch): BatchSummary {
  return {
    id: batch.id,
    name: batch.name,
    slug: batch.slug,
    source: batch.source,
    status: batch.status,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
    totalUploads: batch.uploads.length,
    totalFiles: batch.files.length,
    approvedFiles: batch.files.filter((file) => file.reviewStatus === "approved").length,
    rejectedFiles: batch.files.filter((file) => file.reviewStatus === "rejected").length,
    pendingFiles: batch.files.filter((file) => file.reviewStatus === "pending").length,
    conflicts: batch.files.filter((file) => file.conflictStatus !== "none").length,
  };
}

class LocalAdminContentStorage implements AdminContentStorage {
  async createBatch(batch: UploadBatch) {
    await this.updateBatch(batch);
    return batch;
  }

  async updateBatch(batch: UploadBatch) {
    writeJsonFile(localPath("batches", `${batch.id}.json`), batch);
    const current = readJsonFile<BatchSummary[]>(localPath(INDEX_FILE), []);
    const summary = summarizeBatch(batch);
    const next = current.filter((entry) => entry.id !== batch.id);
    next.unshift(summary);
    writeJsonFile(localPath(INDEX_FILE), next);
    return batch;
  }

  async listBatches() {
    return readJsonFile<BatchSummary[]>(localPath(INDEX_FILE), []);
  }

  async getBatch(batchId: string) {
    return readJsonFile<UploadBatch | null>(localPath("batches", `${batchId}.json`), null);
  }

  async saveBinary(path: string, content: Buffer, _contentType: string) {
    const target = localPath(path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  async deleteBinary(path: string) {
    const target = localPath(path);
    if (existsSync(target)) {
      unlinkSync(target);
    }
  }

  async readBinary(path: string) {
    const target = localPath(path);
    return existsSync(target) ? readFileSync(target) : null;
  }

  async appendAuditEvent(event: AuditEvent) {
    const current = readJsonFile<AuditEvent[]>(localPath(AUDIT_FILE), []);
    current.unshift(event);
    writeJsonFile(localPath(AUDIT_FILE), current.slice(0, 1000));
  }

  async listAuditHistory(batchId?: string) {
    const all = readJsonFile<AuditEvent[]>(localPath(AUDIT_FILE), []);
    return batchId ? all.filter((entry) => entry.batchId === batchId) : all;
  }

  async createExport(exportPackage: ExportPackage, archive: Buffer) {
    await this.saveBinary(exportPackage.storagePath, archive, "application/zip");
    writeJsonFile(localPath("exports", `${exportPackage.id}.json`), exportPackage);
    return exportPackage;
  }
}

class SupabaseObjectStorage implements AdminContentStorage {
  private bucketVerified = false;

  constructor(private readonly bucket: string, private readonly prefix: string) {}

  private get baseUrl() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase storage requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
    return { url, key };
  }

  private objectPath(path: string) {
    return `${this.prefix}/${path}`;
  }

  private async ensureBucketExists() {
    if (this.bucketVerified) return;
    const { url, key } = this.baseUrl;
    const read = await fetch(`${url}/storage/v1/bucket/${this.bucket}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + key,
        apikey: key,
      },
      cache: "no-store",
    });
    if (read.status === 404) {
      const created = await fetch(`${url}/storage/v1/bucket`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + key,
          apikey: key,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: this.bucket,
          name: this.bucket,
          public: false,
        }),
        cache: "no-store",
      });
      if (!created.ok) {
        throw new Error(`Supabase bucket setup failed: ${created.status} ${await created.text()}`);
      }
    } else if (!read.ok) {
      throw new Error(`Supabase bucket check failed: ${read.status} ${await read.text()}`);
    }
    this.bucketVerified = true;
  }

  private async request(path: string, init: RequestInit = {}) {
    const { url, key } = this.baseUrl;
    await this.ensureBucketExists();
    const response = await fetch(`${url}/storage/v1/object/${this.bucket}/${path}`, {
      ...init,
      headers: {
        Authorization: "Bearer " + key,
        apikey: key,
        "x-upsert": "true",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!response.ok && response.status !== 404) {
      throw new Error(`Supabase storage request failed: ${response.status} ${await response.text()}`);
    }
    return response;
  }

  private async readJson<T>(path: string, fallback: T) {
    const response = await this.request(this.objectPath(path));
    if (response.status === 404) return fallback;
    return (await response.json()) as T;
  }

  private async writeJson(path: string, value: unknown) {
    await this.request(this.objectPath(path), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
  }

  async createBatch(batch: UploadBatch) {
    await this.updateBatch(batch);
    return batch;
  }

  async updateBatch(batch: UploadBatch) {
    await this.writeJson(`batches/${batch.id}.json`, batch);
    const current = await this.readJson<BatchSummary[]>(INDEX_FILE, []);
    const next = current.filter((entry) => entry.id !== batch.id);
    next.unshift(summarizeBatch(batch));
    await this.writeJson(INDEX_FILE, next);
    return batch;
  }

  async listBatches() {
    return this.readJson<BatchSummary[]>(INDEX_FILE, []);
  }

  async getBatch(batchId: string) {
    return this.readJson<UploadBatch | null>(`batches/${batchId}.json`, null);
  }

  async saveBinary(path: string, content: Buffer, contentType: string) {
    await this.request(this.objectPath(path), {
      method: "POST",
      headers: { "content-type": contentType },
      body: new Uint8Array(content),
    });
  }

  async readBinary(path: string) {
    const response = await this.request(this.objectPath(path));
    if (response.status === 404) return null;
    return Buffer.from(await response.arrayBuffer());
  }

  async deleteBinary(path: string) {
    await this.request(this.objectPath(path), { method: "DELETE" });
  }

  async appendAuditEvent(event: AuditEvent) {
    const current = await this.readJson<AuditEvent[]>(AUDIT_FILE, []);
    current.unshift(event);
    await this.writeJson(AUDIT_FILE, current.slice(0, 1000));
  }

  async listAuditHistory(batchId?: string) {
    const all = await this.readJson<AuditEvent[]>(AUDIT_FILE, []);
    return batchId ? all.filter((entry) => entry.batchId === batchId) : all;
  }

  async createExport(exportPackage: ExportPackage, archive: Buffer) {
    await this.saveBinary(exportPackage.storagePath, archive, "application/zip");
    await this.writeJson(`exports/${exportPackage.id}.json`, exportPackage);
    return exportPackage;
  }
}

let cachedStorage: AdminContentStorage | null = null;

function resolveStorageBucketName() {
  return process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? "";
}

export function getAdminContentStorage(): AdminContentStorage {
  if (cachedStorage) {
    return cachedStorage;
  }

  const bucket = resolveStorageBucketName();
  const canUseSupabase = Boolean(bucket && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (canUseSupabase) {
    cachedStorage = new SupabaseObjectStorage(bucket as string, DEFAULT_STORAGE_PREFIX);
    return cachedStorage;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Configure EDUNANCIAL_UPLOAD_STORAGE_BUCKET (or EDUNANCIAL_UPLOAD_STORAGE_KEY) with Supabase credentials for production admin content storage.",
    );
  }

  cachedStorage = new LocalAdminContentStorage();
  return cachedStorage;
}

export function getLocalAdminStorageFiles() {
  return existsSync(LOCAL_ROOT) ? readdirSync(LOCAL_ROOT, { recursive: true }) : [];
}

export function resetAdminContentStorage() {
  cachedStorage = null;
  rmSync(LOCAL_ROOT, { recursive: true, force: true });
}
