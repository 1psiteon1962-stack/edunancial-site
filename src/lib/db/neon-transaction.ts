import { Pool } from "@neondatabase/serverless";
import { readDatabaseUrl } from "@/lib/db/neon";
import type { PublicationLease } from "@/lib/admin-content/publication-lock";

export async function withNeonTransaction<T>(fn:(client:any)=>Promise<T>):Promise<T>{
 const url=readDatabaseUrl();if(!url)throw new Error("Neon transaction requires DATABASE_URL or NETLIFY_DATABASE_URL.");
 const pool=new Pool({connectionString:url});
 const client=await pool.connect();
 try{
  await client.query("BEGIN");
  const value=await fn(client);
  await client.query("COMMIT");
  return value;
 }catch(error){
  try{await client.query("ROLLBACK");}catch{}
  throw error;
 }finally{client.release();await pool.end();}
}

export async function assertLeaseInsideTransaction(client:any,lease:PublicationLease){
 if(lease.backend!=="neon"||!lease.fencingToken)throw new Error("Transactional publication requires a fenced Neon lease.");
 const result=await client.query(
  "select fencing_token from curriculum_publication_leases where lease_key='global' and owner=$1 and fencing_token=$2 and expires_at>now() for update",
  [lease.owner,lease.fencingToken]
 );
 if(result.rowCount!==1)throw new Error("Publication lease was lost before transactional commit.");
}

export async function bumpCurriculumGeneration(client:any):Promise<number>{
 const result=await client.query("update curriculum_generation set generation=generation+1,updated_at=now() where id=true returning generation");
 if(result.rowCount!==1)throw new Error("curriculum_generation row is missing.");
 return Number(result.rows[0].generation);
}
