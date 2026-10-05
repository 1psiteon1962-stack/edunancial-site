import { randomUUID } from "node:crypto";

import { getAdminContentStorage } from "@/lib/admin-content/storage";

export type RecoveryJob = {
  id: string;
  token: string;
  batchId: string;
  uploadId: string;
  actorEmail: string;
  state: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  error: string | null;
  reviewBatchId: string | null;
};

const pathFor = (id: string) => `jobs/recovery/${id}.json`;

export async function createRecoveryJob(input: Pick<RecoveryJob, "batchId" | "uploadId" | "actorEmail">) {
  const now = new Date().toISOString();
  const job: RecoveryJob = {
    id: randomUUID(),
    token: randomUUID() + randomUUID(),
    ...input,
    state: "QUEUED",
    createdAt: now,
    updatedAt: now,
    error: null,
    reviewBatchId: null,
  };
  await getAdminContentStorage().saveBinary(pathFor(job.id), Buffer.from(JSON.stringify(job)), "application/json");
  return job;
}

export async function getRecoveryJob(id: string) {
  const raw = await getAdminContentStorage().readBinary(pathFor(id));
  if (!raw) return null;
  try { return JSON.parse(raw.toString("utf8")) as RecoveryJob; } catch { return null; }
}

export async function updateRecoveryJob(id: string, patch: Partial<RecoveryJob>) {
  const current = await getRecoveryJob(id);
  if (!current) throw new Error("Recovery job not found.");
  const next = { ...current, ...patch, id: current.id, token: current.token, updatedAt: new Date().toISOString() };
  await getAdminContentStorage().saveBinary(pathFor(id), Buffer.from(JSON.stringify(next)), "application/json");
  return next;
}
