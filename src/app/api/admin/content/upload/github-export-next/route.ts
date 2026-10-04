import { NextRequest } from "next/server";
import { authorizeGithubActionsRun } from "@/lib/admin-content/github-actions-runner-auth";
import { listPendingGithubExportReceipts, recordGithubExport } from "@/lib/admin-content/upload-receipts";
import { exportBatchToGithub } from "@/lib/admin-content/service";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=60;

export async function POST(request:NextRequest){
 if(!(await authorizeGithubActionsRun(request,["schedule","workflow_dispatch"])))return Response.json({success:false,error:"Unauthorized Git export runner."},{status:401});
 const [receipt]=await listPendingGithubExportReceipts(1);
 if(!receipt)return Response.json({success:true,done:true},{headers:{"Cache-Control":"private, no-store"}});
 if(!receipt.reviewBatchId){
  await recordGithubExport(receipt.uploadId,{ok:false,error:"Published receipt has no review batch ID."});
  return Response.json({success:false,done:false,uploadId:receipt.uploadId,error:"Published receipt has no review batch ID."},{status:422});
 }
 try{
  const result=await exportBatchToGithub(receipt.reviewBatchId,{email:"github-actions-export@edunancial.internal"});
  await recordGithubExport(receipt.uploadId,{ok:true,branch:result.branch,pullRequestUrl:result.pullRequestUrl});
  return Response.json({success:true,done:false,uploadId:receipt.uploadId,reviewBatchId:receipt.reviewBatchId,branch:result.branch,pullRequestUrl:result.pullRequestUrl},{headers:{"Cache-Control":"private, no-store"}});
 }catch(error){
  const message=error instanceof Error?error.message:String(error);
  await recordGithubExport(receipt.uploadId,{ok:false,error:message});
  const permissionHint=/403|resource not accessible|permission/iu.test(message)?"EDUNANCIAL_GITHUB_TOKEN requires Pull requests: Read and write.":null;
  return Response.json({success:false,done:false,uploadId:receipt.uploadId,error:message,permissionHint},{status:503,headers:{"Cache-Control":"private, no-store"}});
 }
}
