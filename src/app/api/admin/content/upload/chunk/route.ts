import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { assertValidUploadName } from "@/lib/admin-content/security";
import { getAdminContentStorage } from "@/lib/admin-content/storage";

export const runtime="nodejs";export const dynamic="force-dynamic";export const maxDuration=300;
const MAX_PART=3_000_000;
function validSha(value:string){return /^[a-f0-9]{64}$/u.test(value)}

export async function POST(request:NextRequest){
 try{
  const auth=await requireAdminApiSession(request,true);if(!auth.ok)return auth.response;
  const uploadId=request.nextUrl.searchParams.get("uploadId")?.trim()??"";
  const filename=request.nextUrl.searchParams.get("name")?.trim()??"";
  const sha=request.nextUrl.searchParams.get("sha256")?.trim().toLowerCase()??"";
  const part=Number(request.nextUrl.searchParams.get("part")??"-1");
  const total=Number(request.nextUrl.searchParams.get("total")??"0");
  if(!uploadId||!validSha(sha)||!Number.isInteger(part)||part<0||!Number.isInteger(total)||total<1||part>=total)throw new Error("Invalid chunk metadata.");
  assertValidUploadName(filename);
  const bytes=Buffer.from(await request.arrayBuffer());if(bytes.length>MAX_PART)throw new Error("Upload chunk exceeds 3 MB.");
  const path=`upload-parts/${uploadId}/${String(part).padStart(5,"0")}`;
  await getAdminContentStorage().saveBinary(path,bytes,"application/octet-stream");
  return Response.json({success:true,part,total},{status:201});
 }catch(error){return Response.json({success:false,error:(error as Error).message},{status:400});}
}

export async function PUT(request:NextRequest){
 try{
  const auth=await requireAdminApiSession(request,true);if(!auth.ok)return auth.response;
  const body=await request.json() as {uploadId?:string;name?:string;sha256?:string;total?:number;storagePath?:string};
  const uploadId=body.uploadId?.trim()??"",filename=body.name?.trim()??"",sha=(body.sha256??"").toLowerCase(),total=Number(body.total),storagePath=body.storagePath?.trim()??"";
  if(!uploadId||!validSha(sha)||!Number.isInteger(total)||total<1||!storagePath.startsWith("uploads/"))throw new Error("Invalid completion metadata.");
  assertValidUploadName(filename);
  const storage=getAdminContentStorage(),parts:Buffer[]=[];
  for(let i=0;i<total;i++){const b=await storage.readBinary(`upload-parts/${uploadId}/${String(i).padStart(5,"0")}`);if(!b)throw new Error(`Missing upload chunk ${i+1} of ${total}.`);parts.push(b);}
  const bytes=Buffer.concat(parts),actual=createHash("sha256").update(bytes).digest("hex");if(actual!==sha)throw new Error("SHA-256 integrity check failed.");
  const contentPath=`packages/sha256/${sha}.zip`;await storage.saveBinary(contentPath,bytes,"application/zip");
  await storage.saveBinary(storagePath,bytes,"application/zip");
  return Response.json({success:true,storagePath,contentPath,sha256:sha,sizeBytes:bytes.length});
 }catch(error){return Response.json({success:false,error:(error as Error).message},{status:400});}
}
