import type { Handler } from "@netlify/functions";
import { getNeonSql } from "../../src/lib/db/neon";
import { recoverStoredCurriculumPackage } from "../../src/lib/admin-content/recovery-worker";

export const handler:Handler=async()=>{
 const sql=getNeonSql();if(!sql)return{statusCode:503,body:"Neon unavailable"};
 const rows=await sql`select upload_id,original_batch_id from curriculum_uploads where state in ('RECOVERABLE','READY') order by updated_at asc limit 10`;
 const actor={userId:"background-curriculum-publisher",email:"system@edunancial.internal",role:"admin" as const};
 const results:Array<{uploadId:string;ok:boolean;error?:string}>=[];
 for(const row of rows){
  try{await recoverStoredCurriculumPackage({batchId:String(row.original_batch_id),uploadId:String(row.upload_id),actor});results.push({uploadId:String(row.upload_id),ok:true});}
  catch(error){results.push({uploadId:String(row.upload_id),ok:false,error:error instanceof Error?error.message:String(error)});}
 }
 return{statusCode:200,body:JSON.stringify({processed:results.length,results})};
};
