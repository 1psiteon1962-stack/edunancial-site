import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { getNeonSql } from "@/lib/db/neon";

const LOCK_PATH = "locks/curriculum-publication.json";
const LEASE_MS = 90_000;
const LEASE_REFRESH_MS = 60_000;

export type PublicationLease = { owner: string; purpose: string; acquiredAt: string; expiresAt: string; fencingToken?: number; backend?: "neon"|"blob" };

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
  const sql=getNeonSql();
  if(sql){
    const owner=`${purpose}:${crypto.randomUUID()}`;
    const rows=await sql`insert into curriculum_publication_leases(lease_key,owner,purpose,fencing_token,acquired_at,expires_at)
      values('global',${owner},${purpose},1,now(),now()+interval '90 seconds')
      on conflict(lease_key) do update set owner=excluded.owner,purpose=excluded.purpose,fencing_token=curriculum_publication_leases.fencing_token+1,acquired_at=now(),expires_at=excluded.expires_at
      where curriculum_publication_leases.expires_at<=now()
      returning owner,purpose,fencing_token,acquired_at,expires_at`;
    const row=rows[0] as Record<string,unknown>|undefined;
    if(!row)throw new PublicationBusyError(5_000);
    return {owner:String(row.owner),purpose:String(row.purpose),fencingToken:Number(row.fencing_token),acquiredAt:new Date(String(row.acquired_at)).toISOString(),expiresAt:new Date(String(row.expires_at)).toISOString(),backend:"neon"};
  }
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

export async function renewPublicationLease(lease: PublicationLease): Promise<PublicationLease> {
  if(lease.backend==="neon"){
    const sql=getNeonSql();if(!sql)throw new Error("Neon publication lease backend disappeared.");
    const rows=await sql`update curriculum_publication_leases set expires_at=now()+interval '90 seconds'
      where lease_key='global' and owner=${lease.owner} and fencing_token=${lease.fencingToken??0} and expires_at>now()
      returning expires_at`;
    if(!rows[0])throw new Error("Publication lease is no longer held; refusing to renew.");
    lease.expiresAt=new Date(String((rows[0] as Record<string,unknown>).expires_at)).toISOString();return lease;
  }
  const storage = getAdminContentStorage();
  if (!storage.updateBinary) throw new Error("Storage does not support publication lease renewal.");
  const next = { ...lease, expiresAt: new Date(Date.now() + LEASE_MS).toISOString() };
  const updated = await storage.updateBinary(LOCK_PATH, (current) => {
    const existing = parse(current);
    if (existing?.owner !== lease.owner) return null;
    return bytes(next);
  }, "Renew curriculum publication lease");
  if (!updated) throw new Error("Publication lease is no longer held; refusing to renew.");
  lease.expiresAt = next.expiresAt;
  return lease;
}

export async function assertLeaseHeld(lease: PublicationLease): Promise<void> {
  assertLeaseFresh(lease);
  if(lease.backend==="neon"){const sql=getNeonSql();if(!sql)throw new Error("Neon publication lease backend disappeared.");const rows=await sql`select 1 from curriculum_publication_leases where lease_key='global' and owner=${lease.owner} and fencing_token=${lease.fencingToken??0} and expires_at>now()`;if(!rows[0])throw new Error("Publication lease is no longer held by this request; refusing to commit.");return;}
  const current = parse(await getAdminContentStorage().readBinary(LOCK_PATH));
  if (current?.owner !== lease.owner) throw new Error("Publication lease is no longer held by this request; refusing to commit.");
}

export async function releasePublicationLease(lease: PublicationLease): Promise<void> {
  if(lease.backend==="neon"){try{const sql=getNeonSql();if(sql)await sql`delete from curriculum_publication_leases where lease_key='global' and owner=${lease.owner} and fencing_token=${lease.fencingToken??0}`;}catch(error){console.warn("[publication-lock] Neon release failed; lease will expire",error);}return;}
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
  let heartbeatError: unknown = null;
  const timer = setInterval(() => { void renewPublicationLease(lease).catch((error) => { heartbeatError = error; }); }, LEASE_REFRESH_MS);
  try {
    const result = await fn(lease);
    if (heartbeatError) throw heartbeatError;
    return result;
  } finally {
    clearInterval(timer);
    await releasePublicationLease(lease);
  }
}
