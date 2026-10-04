import { Buffer } from "node:buffer";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
const LOCK_PATH="locks/curriculum-publication.json";
const LEASE_MS=90_000;
export type PublicationLease={owner:string;purpose:string;acquiredAt:string;expiresAt:string};
export class PublicationBusyError extends Error{retryAfterMs:number;constructor(retryAfterMs:number){super("Another curriculum publication is already in progress.");this.name="PublicationBusyError";this.retryAfterMs=retryAfterMs;}}
function bytes(v:PublicationLease){return Buffer.from(`${JSON.stringify(v,null,2)}\n`,"utf8")}
export async function acquirePublicationLease(purpose:string):Promise<PublicationLease>{
 const storage=getAdminContentStorage();const now=Date.now();const lease:PublicationLease={owner:`${purpose}:${crypto.randomUUID()}`,purpose,acquiredAt:new Date(now).toISOString(),expiresAt:new Date(now+LEASE_MS).toISOString()};
 if(storage.createIfAbsent&&await storage.createIfAbsent(LOCK_PATH,bytes(lease),"application/json","Acquire curriculum publication lease"))return lease;
 const raw=await storage.readBinary(LOCK_PATH);if(raw){try{const current=JSON.parse(raw.toString("utf8")) as PublicationLease;const remaining=new Date(current.expiresAt).getTime()-Date.now();if(remaining>0)throw new PublicationBusyError(remaining);}catch(e){if(e instanceof PublicationBusyError)throw e;}}
 if(!storage.updateBinary)throw new Error("Storage does not support publication leasing.");
 let acquired=false;await storage.updateBinary(LOCK_PATH,(current)=>{if(current){try{const old=JSON.parse(current.toString("utf8")) as PublicationLease;if(new Date(old.expiresAt).getTime()>Date.now())return null;}catch{}}acquired=true;return bytes(lease);},"Take over expired curriculum publication lease");
 if(!acquired)throw new PublicationBusyError(5_000);return lease;
}
export async function releasePublicationLease(lease:PublicationLease){const storage=getAdminContentStorage();const raw=await storage.readBinary(LOCK_PATH);if(!raw)return;if(storage.deleteIfVersion){await storage.deleteIfVersion(LOCK_PATH,raw,"Release curriculum publication lease");return;}await storage.deleteBinary(LOCK_PATH);}
export function assertLeaseFresh(lease:PublicationLease){if(Date.now()>=new Date(lease.expiresAt).getTime())throw new Error("Publication lease expired before durable commit.");}
export async function withPublicationLease<T>(purpose:string,fn:(lease:PublicationLease)=>Promise<T>):Promise<T>{const lease=await acquirePublicationLease(purpose);try{return await fn(lease);}finally{await releasePublicationLease(lease);}}
