import { createHmac, timingSafeEqual } from "node:crypto";

const baseUrl = () => (process.env.WORKER_BASE_URL || "").trim().replace(/\/$/u, "");
const secret = () => (process.env.WORKER_SHARED_SECRET || "").trim();

function signature(method: string, path: string, expires: number) {
  const key = secret();
  if (key.length < 32) throw new Error("WORKER_SHARED_SECRET is not configured.");
  return createHmac("sha256", key).update(`${method.toUpperCase()}\n${path}\n${expires}`).digest("hex");
}

export function createWorkerMediaUrl(path: string, method: "PUT" | "GET", ttlSeconds = 3600) {
  const origin = baseUrl();
  if (!origin || !origin.startsWith("https://")) throw new Error("WORKER_BASE_URL is not configured.");
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const route = `/media/${encodedPath}`;
  const sig = signature(method, path, expires);
  return `${origin}${route}?expires=${expires}&sig=${sig}`;
}

export function verifyWorkerMediaSignature(method: string, path: string, expires: number, supplied: string) {
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const expected = signature(method, path, expires);
  const a = Buffer.from(supplied || "");
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
