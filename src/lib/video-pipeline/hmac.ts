import { createHash, createHmac, randomUUID } from "node:crypto";

export type SignedWorkerRequest = {
  timestamp: string;
  requestId: string;
  signature: string;
};

function getWorkerSecret() {
  const secret = process.env.WORKER_SHARED_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("WORKER_SHARED_SECRET must be at least 32 characters.");
  return secret;
}

export function signWorkerRequest(method: string, path: string, body: string): SignedWorkerRequest {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const requestId = randomUUID();
  const bodyHash = createHash("sha256").update(body).digest("hex");
  const canonical = [timestamp, requestId, method.toUpperCase(), path, bodyHash].join("\n");
  const signature = createHmac("sha256", getWorkerSecret()).update(canonical).digest("hex");
  return { timestamp, requestId, signature };
}
