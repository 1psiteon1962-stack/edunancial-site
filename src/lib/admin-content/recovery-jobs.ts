import { randomUUID } from "node:crypto";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export type RecoveryJobState = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";
export type RecoveryJob = {
  id:string; token:string; batchId:string; uploadId:string; actorEmail:string; state:RecoveryJobState;
  phase:string|null; createdAt:string; updatedAt:string; startedAt:string|null; heartbeatAt:string|null; finishedAt:string|null;
  error:string|null; reviewBatchId:string|null;
};
export const RECOVERY_QUEUED_TIMEOUT_MS=3*60_000;
export const RECOVERY_HEARTBEAT_TIMEOUT_MS=16*60_000;
export const RECOVERY_HEARTBEAT_INTERVAL_MS=30_000;
const pathFor=(id:string)=>`jobs/recovery/${id}.json`;
function parse(raw:Buffer|null):RecoveryJob|null{if(!raw)return null;try{return JSON.parse(raw.toString("utf8")) as RecoveryJob}catch{return null}}

export async function createRecoveryJob(input:Pick<RecoveryJob,"batchId"|"uploadId"|"actorEmail">){
 const now=new Date().toISOString();
 const job:RecoveryJob={id:randomUUID(),token:randomUUID()+randomUUID(),...input,state:"QUEUED",phase:"QUEUED",createdAt:now,updatedAt:now,startedAt:null,heartbeatAt:null,finishedAt:null,error:null,reviewBatchId:null};
 await getAdminContentStorage().saveBinary(pathFor(job.id),Buffer.from(JSON.stringify(job)),"application/json");return job;
}
export async function getRecoveryJob(id:string){return parse(await getAdminContentStorage().readBinary(pathFor(id)))}
export async function updateRecoveryJob(id:string,patch:Partial<RecoveryJob>,guard?:(current:RecoveryJob)=>boolean){
 const storage=getAdminContentStorage();let written:RecoveryJob|null=null;
 const apply=(current:RecoveryJob|null)=>{if(!current)throw new Error("Recovery job not found.");if(guard&&!guard(current))return null;written={...current,...patch,id:current.id,token:current.token,updatedAt:new Date().toISOString()};return written};
 if(storage.updateBinary){const ok=await storage.updateBinary(pathFor(id),(raw)=>{written=null;const next=apply(parse(raw));return next?Buffer.from(JSON.stringify(next)):null});if(!ok&&written)throw new Error("Recovery job update lost a compare-and-swap race repeatedly.");return ok?written:null}
 const next=apply(await getRecoveryJob(id));if(next)await storage.saveBinary(pathFor(id),Buffer.from(JSON.stringify(next)),"application/json");return next;
}
export async function reapStaleRecoveryJob(job:RecoveryJob,now=Date.now()):Promise<RecoveryJob>{
 if(job.state==="QUEUED"&&now-new Date(job.createdAt).getTime()>RECOVERY_QUEUED_TIMEOUT_MS){const reaped=await updateRecoveryJob(job.id,{state:"FAILED",finishedAt:new Date(now).toISOString(),error:"Background worker never started this job (dispatch or worker boot failed). Check the curriculum-recovery-background function log. The stored ZIP remains preserved."},c=>c.state==="QUEUED");return reaped??await getRecoveryJob(job.id)??job}
 const lastSign=job.heartbeatAt??job.startedAt??job.updatedAt;
 if(job.state==="RUNNING"&&now-new Date(lastSign).getTime()>RECOVERY_HEARTBEAT_TIMEOUT_MS){const reaped=await updateRecoveryJob(job.id,{state:"FAILED",finishedAt:new Date(now).toISOString(),error:`Background worker was terminated without recording an outcome (last phase: ${job.phase??"unknown"}, last heartbeat: ${lastSign}). The stored ZIP remains preserved.`},c=>c.state==="RUNNING"&&(c.heartbeatAt??c.startedAt??c.updatedAt)===lastSign);return reaped??await getRecoveryJob(job.id)??job}
 return job;
}
