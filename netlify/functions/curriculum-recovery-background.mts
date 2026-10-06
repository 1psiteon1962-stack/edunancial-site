import "../../src/lib/admin-content/function-runtime";
import { getRecoveryJob, RECOVERY_HEARTBEAT_INTERVAL_MS, updateRecoveryJob } from "../../src/lib/admin-content/recovery-jobs";
import { recoverStoredCurriculumPackage } from "../../src/lib/admin-content/recovery-worker";

const log=(jobId:string,message:string,extra?:unknown)=>console.log(`[curriculum-recovery-background] job=${jobId} ${message}`,extra??"");
export default async(request:Request)=>{
 let jobId="";let heartbeat:ReturnType<typeof setInterval>|null=null;
 try{
  const body=await request.json() as {jobId?:string;token?:string};jobId=String(body.jobId??"");const token=String(body.token??"");
  log(jobId,`start NODE_ENV=${process.env.NODE_ENV??"unset"}`);
  const job=await getRecoveryJob(jobId);
  if(!job){console.error(`[curriculum-recovery-background] job=${jobId} not found in storage`);return}
  if(!token||token!==job.token){console.error(`[curriculum-recovery-background] job=${jobId} rejected invalid job token`);return}
  if(job.state==="SUCCEEDED"||job.state==="FAILED"){log(jobId,`already ${job.state}; nothing to do`);return}
  const startedAt=new Date().toISOString();
  await updateRecoveryJob(job.id,{state:"RUNNING",phase:"STARTED",startedAt,heartbeatAt:startedAt,error:null});
  heartbeat=setInterval(()=>{void updateRecoveryJob(job.id,{heartbeatAt:new Date().toISOString()},c=>c.state==="RUNNING").catch(error=>console.warn(`[curriculum-recovery-background] job=${jobId} heartbeat failed`,error))},RECOVERY_HEARTBEAT_INTERVAL_MS);
  const result=await recoverStoredCurriculumPackage({batchId:job.batchId,uploadId:job.uploadId,actor:{email:job.actorEmail},onPhase:async phase=>{log(jobId,`phase=${phase}`);await updateRecoveryJob(job.id,{phase,heartbeatAt:new Date().toISOString()},c=>c.state==="RUNNING")}});
  clearInterval(heartbeat);heartbeat=null;
  await updateRecoveryJob(job.id,{state:"SUCCEEDED",phase:"LEARNER_VERIFIED_PUBLISHED",reviewBatchId:result.reviewBatchId,error:null,finishedAt:new Date().toISOString()});
  log(jobId,"SUCCEEDED");
 }catch(error){
  if(heartbeat)clearInterval(heartbeat);
  console.error(`[curriculum-recovery-background] job=${jobId} failed`,error);
  if(jobId){try{await updateRecoveryJob(jobId,{state:"FAILED",error:error instanceof Error?error.message:String(error),finishedAt:new Date().toISOString()})}catch(persistError){console.error(`[curriculum-recovery-background] job=${jobId} could not persist FAILED`,persistError)}}
 }
};
