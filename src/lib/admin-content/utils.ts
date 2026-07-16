import { createHash, randomBytes, randomUUID } from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

export function createCsrfToken() {
  return randomBytes(24).toString("base64url");
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[\s_.]+/g, "-")
    .replace(/-+/g, "-") || "batch";
}

export function sha256(buffer: Buffer | string) {
  return `sha256:${createHash("sha256").update(buffer).digest("hex")}`;
}

export function encodeBase64(buffer: Buffer) {
  return buffer.toString("base64");
}

export function decodeBase64(value: string) {
  return Buffer.from(value, "base64");
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function summarizeText(value: string, limit = 400) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length <= limit ? compact : `${compact.slice(0, limit)}…`;
}

export function normalizeSimilarityText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
}
