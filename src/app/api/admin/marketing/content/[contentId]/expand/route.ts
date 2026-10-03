import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { expandApprovedMarketingContent } from "@/lib/marketing/generation-queue";
export async function POST(request:Request,{params}:{params:Promise<{contentId:string}>}){const auth=await requireOwnerApiSession(request,true);if(!auth.ok)return auth.response;try{const {contentId}=await params;return Response.json(await expandApprovedMarketingContent(contentId));}catch(e){return Response.json({error:e instanceof Error?e.message:"Could not expand marketing content."},{status:400});}}
