import type { Handler } from "@netlify/functions";
import { getNeonSql } from "../../src/lib/db/neon";

export const handler:Handler=async()=>{
 const sql=getNeonSql();if(!sql)return{statusCode:503,body:"Neon unavailable"};
 const rows=await sql`update curriculum_uploads set state='RECOVERABLE',updated_at=now(),last_error=coalesce(last_error,'Publication interrupted; queued for automatic recovery.') where state='PUBLISHING' and updated_at<now()-interval '10 minutes' returning upload_id`;
 return{statusCode:200,body:JSON.stringify({requeued:rows.length})};
};
