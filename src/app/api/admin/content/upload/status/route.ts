import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getUploadReceipt } from "@/lib/admin-content/upload-receipts";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:NextRequest){
 const auth=await requireAdminApiSession(request);
 if(!auth.ok)return auth.response;
 const body=await request.json().catch(()=>({})) as {uploadIds?:unknown};
 const ids=Array.isArray(body.uploadIds)?body.uploadIds.filter((v):v is string=>typeof v==="string"&&v.length>0).slice(0,200):[];
 if(!ids.length)return Response.json({error:"uploadIds is required."},{status:400});
 const receipts=await Promise.all(ids.map(async uploadId=>[uploadId,await getUploadReceipt(uploadId)] as const));
 return Response.json({success:true,receipts:Object.fromEntries(receipts)},{headers:{"Cache-Control":"private, no-store, max-age=0"}});
}
