import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { approveCurrentRevision } from "@/lib/blog/admin-repository";
export async function POST(request:NextRequest,{params}:{params:Promise<{articleId:string}>}){const auth=await requireAdminApiSession(request,true);if(!auth.ok)return auth.response;try{const {articleId}=await params;return Response.json({ok:true,...await approveCurrentRevision(articleId,auth.session.email)});}catch(e){return Response.json({error:e instanceof Error?e.message:"Approval failed."},{status:400});}}
