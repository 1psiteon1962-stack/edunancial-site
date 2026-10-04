import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";

const LOCK_PATH = "locks/curriculum-publication.json";
const LEASE_MS = 90_000;

export type PublicationLease = { owner: string; purpose: string; acquiredAt: string; expiresAt: string };

export class PublicationBusyError extends Error {
  retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super("Another curriculum publication is already in progress.");
    this.name = "PublicationBusyError";
    this.retryAfterMs = Math.max(2_000, Math.min(LEASE_MS, retryAfterMs));
  }
}

function bytes(value: PublicationLease): Buffer {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parse(raw: Buffer | null): PublicationLease | null {
  if (!raw) return null;
  try { return JSON.parse(raw.toString("utf8")) as PublicationLease; } catch { return null; }
}

function remainingMs(lease: PublicationLease | null): number {
  return lease ? new Date(lease.expiresAt).getTime() - Date.now() : 0;
}

export async function acquirePublicationLease(purpose: string): Promise<PublicationLease> {
  const storage = getAdminContentStorage();
  if (!storage.createIfAbsent || !storage.updateBinary) throw new Error("Storage does not support publication leasing; refusing unserialized publication.");
  const now = Date.now();
  const lease: PublicationLease = { owner: `${purpose}:${crypto.randomUUID()}`, purpose, acquiredAt: new Date(now).toISOString(), expiresAt: new Date(now + LEASE_MS).toISOString() };
  if (await storage.createIfAbsent(LOCK_PATH, bytes(lease), "application/json", "Acquire curriculum publication lease")) return lease;
  const holder = parse(await storage.readBinary(LOCK_PATH));
  if (holder && remainingMs(holder) > 0) throw new PublicationBusyError(remainingMs(holder));
  let busyFor = 5_000;
  const updated = await storage.updateBinary(LOCK_PATH, (current) => {
    const existing = parse(current);
    if (existing && remainingMs(existing) > 0) { busyFor = remainingMs(existing); return null; }
    return bytes(lease);
  }, "Take over expired curriculum publication lease");
  if (!updated) throw new PublicationBusyError(busyFor);
  const confirmed = parse(await storage.readBinary(LOCK_PATH));
  if (confirmed?.owner !== lease.owner) throw new PublicationBusyError(remainingMs(confirmed));
  return lease;
}

export function assertLeaseFresh(lease: PublicationLease): void {
  if (Date.now() >= new Date(lease.expiresAt).getTime() - 15_000) throw new Error("Publication lease expired before durable commit; the package will be retried safely.");
}

export async function assertLeaseHeld(lease: PublicationLease): Promise<void> {
  assertLeaseFresh(lease);
  const current = parse(await getAdminContentStorage().readBinary(LOCK_PATH));
  if (current?.owner !== lease.owner) throw new Error("Publication lease is no longer held by this request; refusing to commit.");
}

export async function releasePublicationLease(lease: PublicationLease): Promise<void> {
  const storage = getAdminContentStorage();
  try {
    const raw = await storage.readBinary(LOCK_PATH);
    if (!raw || parse(raw)?.owner !== lease.owner) return;
    if (storage.deleteIfVersion) { await storage.deleteIfVersion(LOCK_PATH, raw, "Release curriculum publication lease"); return; }
    await storage.updateBinary?.(LOCK_PATH, (current) => {
      const existing = parse(current);
      if (existing?.owner !== lease.owner) return null;
      return bytes({ ...existing, expiresAt: new Date(0).toISOString() });
    }, "Release curriculum publication lease");
  } catch (error) { console.warn("[publication-lock] release failed; lease will expire", error); }
}

export async function withPublicationLease<T>(purpose: string, fn: (lease: PublicationLease) => Promise<T>): Promise<T> {
  const lease = await acquirePublicationLease(purpose);
  try { return await fn(lease); } finally { await releasePublicationLease(lease); }
}
