import { getNeonSql } from "@/lib/db/neon";

export type CurriculumUploadState =
 |"RECEIVING"|"STORED"|"VALIDATING"|"READY"|"PUBLISHING"|"PUBLISHED"
 |"FAILED_VALIDATION"|"RECOVERABLE"|"FAILED_PUBLICATION"|"DUPLICATE"
 |"STORED_FOR_REVIEW"|"FINALIZING"|"FAILED";

const transitions:Record<CurriculumUploadState,ReadonlySet<CurriculumUploadState>>={
 RECEIVING:new Set(["STORED","FAILED"]),
 STORED:new Set(["VALIDATING","FAILED"]),
 VALIDATING:new Set(["READY","FAILED_VALIDATION","FAILED"]),
 READY:new Set(["PUBLISHING","DUPLICATE","FAILED"]),
 PUBLISHING:new Set(["PUBLISHED","RECOVERABLE","FAILED_PUBLICATION","FAILED"]),
 RECOVERABLE:new Set(["READY","PUBLISHING","FAILED_PUBLICATION","FAILED"]),
 FAILED_VALIDATION:new Set(["VALIDATING","FAILED"]),
 FAILED_PUBLICATION:new Set(["READY","FAILED"]),
 DUPLICATE:new Set(),
 PUBLISHED:new Set(),
 STORED_FOR_REVIEW:new Set(["VALIDATING","READY","FAILED"]),
 FINALIZING:new Set(["PUBLISHING","RECOVERABLE","FAILED"]),
 FAILED:new Set(["READY","VALIDATING"])
};

function sqlOrThrow(){const sql=getNeonSql();if(!sql)throw new Error("Durable upload state requires Neon.");return sql;}

export async function transitionCurriculumUpload(uploadId:string,to:CurriculumUploadState,detail:Record<string,unknown>={}){
 const sql=sqlOrThrow();
 const rows=await sql`select state from curriculum_uploads where upload_id=${uploadId} limit 1`;
 const current=rows[0]?.state as CurriculumUploadState|undefined;
 if(!current)throw new Error(`Unknown curriculum upload ${uploadId}`);
 if(current!==to&&!transitions[current]?.has(to))throw new Error(`Invalid curriculum upload transition ${current} -> ${to}`);
 await sql`update curriculum_uploads set state=${to},updated_at=now(),last_error=${typeof detail.error==="string"?detail.error:null} where upload_id=${uploadId}`;
 await sql`insert into curriculum_upload_events(upload_id,event_type,detail) values(${uploadId},${to},${JSON.stringify(detail)}::jsonb)`;
 return to;
}

export async function recordCurriculumUpload(input:{uploadId:string;batchId:string;storagePath:string;filename:string;coordinate?:string;sha256?:string}){
 const sql=sqlOrThrow();
 await sql`insert into curriculum_uploads(upload_id,original_batch_id,storage_path,original_filename,coordinate,content_sha256,state)
 values(${input.uploadId},${input.batchId},${input.storagePath},${input.filename},${input.coordinate??null},${input.sha256??null},'STORED')
 on conflict(upload_id) do nothing`;
 await sql`insert into curriculum_upload_events(upload_id,event_type,detail) values(${input.uploadId},'STORED','{}'::jsonb)`;
}
