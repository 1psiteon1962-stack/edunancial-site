import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { updateJsonCas } from "@/lib/admin-content/storage/cas-json";
import { getNeonSql } from "@/lib/db/neon";

export type UploadReceiptState="STORED"|"FINALIZING"|"STORED_FOR_REVIEW"|"PUBLISHED"|"FAILED";
export type UploadReceipt={
 uploadId:string;originalBatchId:string;storagePath:string;originalFilename:string;coordinate:string|null;
 state:UploadReceiptState;attempts:number;startedAt:string|null;publishedAt:string|null;updatedAt:string;
 reviewBatchId:string|null;retryable:boolean;lastError:string|null;recoveredWithoutReupload:boolean;
 verification:{learnerVisible:boolean;detail:string;checkedLessons?:number;checkedAt?:string}|null;
 githubExport:{state:"NOT_REQUIRED"|"PENDING"|"OPEN"|"FAILED";attempts:number;branch:string|null;pullRequestUrl:string|null;lastError:string|null};
};
const pathFor=(id:string)=>`receipts/${id}.json`;
export async function getUploadReceipt(uploadId:string):Promise<UploadReceipt|null>{const raw=await getAdminContentStorage().readBinary(pathFor(uploadId));if(!raw)return null;try{return JSON.parse(raw.toString("utf8")) as UploadReceipt;}catch{return null;}}
/**
 * An attempt that is still FINALIZING must not be overlapped by a retry.
 * Ambiguous HTTP 500/502/503 responses are retried automatically by the
 * uploader and by recovery; without this guard both attempts passed the
 * "already PUBLISHED?" check and each created its own review batch, lesson
 * write and Git export. A FINALIZING claim older than the longest possible
 * invocation (background recovery functions may run up to 15 minutes) is
 * treated as abandoned so a crashed attempt can never strand an upload.
 */
export const FINALIZING_CLAIM_STALE_MS = 16 * 60_000;
export class FinalizationInProgressError extends Error {
 retryAfterMs:number;
 constructor(uploadId:string,retryAfterMs:number){super(`Upload ${uploadId} is already being finalized by another request; its outcome will be reported by the status endpoint.`);this.name="FinalizationInProgressError";this.retryAfterMs=Math.max(1_000,retryAfterMs);}
}
export function finalizingClaimRemainingMs(receipt:Pick<UploadReceipt,"state"|"startedAt">|null|undefined,now=Date.now()):number{
 if(receipt?.state!=="FINALIZING"||!receipt.startedAt)return 0;
 const started=new Date(receipt.startedAt).getTime();
 if(!Number.isFinite(started))return 0;
 return Math.max(0,started+FINALIZING_CLAIM_STALE_MS-now);
}
export async function beginFinalization(identity:Pick<UploadReceipt,"uploadId"|"originalBatchId"|"storagePath"|"originalFilename"|"coordinate">,reviewBatchId:string,source:"finalize"|"recovery"):Promise<UploadReceipt|null>{
 let inFlightRemainingMs=0;
 const result=await updateJsonCas<UploadReceipt>(pathFor(identity.uploadId),(current)=>{
  if(current?.state==="PUBLISHED")return current;
  // Checked inside the compare-and-swap so two concurrent claims cannot both win.
  inFlightRemainingMs=finalizingClaimRemainingMs(current);
  if(inFlightRemainingMs>0)return null;
  const now=new Date().toISOString();return{...(current??{...identity,state:"STORED",attempts:0,startedAt:null,publishedAt:null,updatedAt:now,reviewBatchId:null,retryable:true,lastError:null,recoveredWithoutReupload:false,verification:null,githubExport:{state:"NOT_REQUIRED",attempts:0,branch:null,pullRequestUrl:null,lastError:null}}),state:"FINALIZING",attempts:(current?.attempts??0)+1,startedAt:now,updatedAt:now,reviewBatchId,retryable:true,lastError:null,recoveredWithoutReupload:source==="recovery"||current?.recoveredWithoutReupload===true};
 },"Begin durable upload finalization");
 if(inFlightRemainingMs>0)throw new FinalizationInProgressError(identity.uploadId,inFlightRemainingMs);
 return result;
}
export async function markPublished(uploadId:string,input:{reviewBatchId:string;verification:{learnerVisible:boolean;detail:string;checkedLessons?:number;checkedAt?:string}|null;githubExportRequired:boolean;recoveredWithoutReupload:boolean}):Promise<UploadReceipt>{
 if(input.verification?.learnerVisible!==true)throw new Error(`Refusing PUBLISHED for ${uploadId}: learner read-back did not pass (${input.verification?.detail??"no verification"}).`);
 const next=await updateJsonCas<UploadReceipt>(pathFor(uploadId),(current)=>{if(!current)throw new Error("Publication receipt missing.");if(current.state==="PUBLISHED")return current;const now=new Date().toISOString();return{...current,state:"PUBLISHED",publishedAt:now,updatedAt:now,reviewBatchId:input.reviewBatchId,retryable:false,lastError:null,recoveredWithoutReupload:input.recoveredWithoutReupload,verification:input.verification,githubExport:{...current.githubExport,state:input.githubExportRequired?"PENDING":"NOT_REQUIRED"}};},"Commit durable learner publication receipt");
 if(!next)throw new Error("Unable to persist publication receipt.");
 const sql=getNeonSql();
 if(sql){await sql`update curriculum_uploads set state='PUBLISHED',updated_at=now(),last_error=null where upload_id=${uploadId} and state<>'PUBLISHED'`;await sql`insert into curriculum_upload_events(upload_id,event_type,detail) values(${uploadId},'PUBLISHED',${JSON.stringify({learnerVerified:true,detail:input.verification.detail})}::jsonb)`;}
 return next;
}
export async function markFailed(uploadId:string,error:string,retryable:boolean){return updateJsonCas<UploadReceipt>(pathFor(uploadId),(current)=>current&&current.state!=="PUBLISHED"?{...current,state:"FAILED",updatedAt:new Date().toISOString(),retryable,lastError:error}:null,"Record durable upload failure");}
export async function recordGithubExport(uploadId:string,result:{ok:boolean;branch?:string;pullRequestUrl?:string;error?:string}){return updateJsonCas<UploadReceipt>(pathFor(uploadId),(current)=>current?{...current,updatedAt:new Date().toISOString(),githubExport:{...current.githubExport,state:result.ok?"OPEN":"FAILED",attempts:current.githubExport.attempts+1,branch:result.branch??current.githubExport.branch,pullRequestUrl:result.pullRequestUrl??current.githubExport.pullRequestUrl,lastError:result.ok?null:(result.error??"GitHub export failed")}}:null,"Update Git export receipt");}
export async function listPendingGithubExportReceipts(limit=40):Promise<UploadReceipt[]>{
 const storage=getAdminContentStorage();
 const entries=await storage.listWorkspaceEntries();
 const receiptPaths=entries.filter((entry)=>entry.startsWith("receipts/")&&entry.endsWith(".json"));
 const receipts=(await Promise.all(receiptPaths.map(async path=>{const raw=await storage.readBinary(path);if(!raw)return null;try{return JSON.parse(raw.toString("utf8")) as UploadReceipt;}catch{return null;}})))
  .filter((receipt):receipt is UploadReceipt=>Boolean(receipt))
  .filter((receipt)=>receipt.state==="PUBLISHED"&&(receipt.githubExport.state==="PENDING"||(receipt.githubExport.state==="FAILED"&&receipt.githubExport.attempts<8)))
  .sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt));
 return receipts.slice(0,Math.max(1,Math.min(limit,100)));
}
export function uploadIdFromStoragePath(storagePath:string){return storagePath.match(/\/(upload_[0-9a-f-]+)-/iu)?.[1]??null;}

export async function markStoredForReview(uploadId:string,reviewBatchId:string,detail:string){return updateJsonCas<UploadReceipt>(pathFor(uploadId),(current)=>current&&current.state!=="PUBLISHED"?{...current,state:"STORED_FOR_REVIEW",updatedAt:new Date().toISOString(),reviewBatchId,retryable:false,lastError:null,verification:{learnerVisible:false,detail}}:null,"Store upload for manual review");}
