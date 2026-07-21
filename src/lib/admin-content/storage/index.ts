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

  async getSignedUploadUrl(_path: string): Promise<string | null> {
    // Local file-system storage does not support signed upload URLs.
    // The client falls back to the legacy single-request upload endpoint.
    return null;
  }
}

class SupabaseObjectStorage implements AdminContentStorage {
  private bucketVerified = false;

  constructor(private readonly bucket: string, private readonly prefix: string) {}

  private get baseUrl() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = resolveSupabaseKey();
    if (!url || !key) {
      throw new Error(
        "Supabase storage requires NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }
    return { url, key };
  }

  private objectPath(path: string) {
    return `${this.prefix}/${path}`;
  }

  /**
   * Validates that a storage path contains only safe characters so that it
   * cannot be used to construct unexpected URLs (SSRF / path-traversal guard).
   * Storage paths are always server-generated; this is a defence-in-depth check.
   */
  private static assertSafePath(path: string) {
    // Allow alphanumeric characters plus the URL-safe set typically used in
    // storage object paths: forward slash, hyphen, underscore, dot.
    // Reject anything else — including encoded sequences or protocol-relative
    // patterns — to prevent URL injection.
    if (!/^[a-zA-Z0-9/\-_.]+$/.test(path)) {
      throw new Error(`Unsafe storage path rejected: ${path}`);
    }
  }
  private async ensureBucketExists() {
    if (this.bucketVerified) return;

    // Bucket creation (INSERT into storage.buckets) requires the service-role key
    // because Supabase Storage RLS blocks that operation for the anon role.  When
    // no service-role key is configured, skip bucket management entirely and assume
    // the bucket was pre-created — attempting to create it with the anon key would
    // fail immediately with a 403 RLS violation.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    if (!serviceRoleKey) {
      this.bucketVerified = true;
      return;
    }

    const { url } = this.baseUrl;
    const read = await fetch(`${url}/storage/v1/bucket/${this.bucket}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + serviceRoleKey,
        apikey: serviceRoleKey,
      },
      cache: "no-store",
    });
    if (read.ok) {
      // Bucket already exists — skip creation.
      this.bucketVerified = true;
      return;
    }

    // Supabase Storage normally returns HTTP 404 for a missing bucket, but some
    // Supabase proxy / PostgREST versions return HTTP 400 with a JSON body whose
    // `statusCode` field is the string "404".  Treat both shapes as "not found"
    // so the server can auto-create the bucket instead of surfacing a hard error.
    let bucketMissing = read.status === 404;
    let bodyText = "";
    if (!bucketMissing) {
      bodyText = await read.text();
      try {
        const body = JSON.parse(bodyText) as { statusCode?: string | number; error?: string };
        bucketMissing = String(body?.statusCode) === "404" || body?.error === "Bucket not found";
      } catch {
        // Non-JSON body — not a missing-bucket signal; fall through to hard error.
      }
    }
    if (!bucketMissing) {
      throw new Error(`Supabase bucket check failed: ${read.status} ${bodyText}`);
    }

    // Bucket is genuinely missing; create it with the service-role key.
    const created = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + serviceRoleKey,
        apikey: serviceRoleKey,
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
      const createdBody = await created.text();
      // If another process raced ahead and created the bucket between our GET and
      // POST, treat the duplicate-key conflict as success.
      let alreadyExists = false;
      try {
        const body = JSON.parse(createdBody) as { error?: string; message?: string };
        alreadyExists =
          body?.error === "Duplicate" ||
          (body?.message ?? "").toLowerCase().includes("already exists");
      } catch {
        // Non-JSON; not a duplicate signal.
      }
      if (!alreadyExists) {
        throw new Error(`Supabase bucket setup failed: ${created.status} ${createdBody}`);
      }
    }
    this.bucketVerified = true;
  }

  private async request(path: string, init: RequestInit = {}) {
    const { url, key } = this.baseUrl;
    SupabaseObjectStorage.assertSafePath(path);
    await this.ensureBucketExists();
    // Encode each path segment individually to prevent URL injection while
    // preserving the '/' separators expected by the Supabase Storage API.
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(`${url}/storage/v1/object/${this.bucket}/${encodedPath}`, {
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

  /**
   * Creates a Supabase signed upload URL so the browser can PUT a file directly
   * to Supabase Storage without routing its content through the Netlify
   * serverless function (which has a 6 MB request-body limit).
   *
   * Requires SUPABASE_SERVICE_ROLE_KEY.  Returns null when only the anon key is
   * configured so callers can fall back to direct upload using the anon key.
   */
  async getSignedUploadUrl(path: string): Promise<string | null> {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) return null;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return null;

    const objectPath = this.objectPath(path);
    // Guard against path-injection / SSRF: storage paths are server-generated
    // but we validate them here as a defence-in-depth measure.
    SupabaseObjectStorage.assertSafePath(objectPath);
    // Encode each segment individually to prevent URL injection.
    const encodedObjectPath = objectPath.split("/").map(encodeURIComponent).join("/");
    await this.ensureBucketExists();

    const response = await fetch(`${url}/storage/v1/object/sign/upload/${this.bucket}/${encodedObjectPath}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + serviceRoleKey,
        apikey: serviceRoleKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // Signed URL creation failed; caller falls back to direct anon-key upload
      // or legacy API-proxied upload.  Do not throw so the upload can still proceed.
      return null;
    }

    const data = (await response.json()) as { signedURL?: string };
    if (!data.signedURL) return null;
    return `${url}${data.signedURL}`;
  }
}

let cachedStorage: AdminContentStorage | null = null;

function resolveStorageBucketName() {
  return process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ?? process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ?? "";
}

/**
 * Resolve the Supabase authentication key for server-side storage operations.
 * Prefers the service-role key (bypasses RLS) and falls back to the anon key
 * so deployments that only configure NEXT_PUBLIC_SUPABASE_ANON_KEY still work.
 */
function resolveSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function getAdminContentStorage(): AdminContentStorage {
  if (cachedStorage) {
    return cachedStorage;
  }

  const bucket = resolveStorageBucketName();
  const canUseSupabase = Boolean(bucket && process.env.NEXT_PUBLIC_SUPABASE_URL && resolveSupabaseKey());

  if (canUseSupabase) {
    cachedStorage = new SupabaseObjectStorage(bucket as string, DEFAULT_STORAGE_PREFIX);
    return cachedStorage;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Production admin content storage requires NEXT_PUBLIC_SUPABASE_URL, " +
        "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY), and " +
        "EDUNANCIAL_UPLOAD_STORAGE_BUCKET (or EDUNANCIAL_UPLOAD_STORAGE_KEY).",
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
