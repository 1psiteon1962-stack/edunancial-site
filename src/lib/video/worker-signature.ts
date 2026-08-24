import { createHmac, randomUUID } from "node:crypto";

export function createWorkerRequest(body: string) {
  const secret = process.env.EDUNANCIAL_VIDEO_WORKER_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("EDUNANCIAL_VIDEO_WORKER_SECRET must be at least 32 characters.");
  const requestId = randomUUID();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `${timestamp}.${requestId}.${body}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return {
    requestId,
    timestamp,
    signature,
    headers: {
      "content-type": "application/json",
      "x-edunancial-request-id": requestId,
      "x-edunancial-timestamp": timestamp,
      "x-edunancial-signature": signature,
    },
  };
}
