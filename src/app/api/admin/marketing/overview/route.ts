import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getMarketingOverview } from "@/lib/marketing/control-plane";
export const dynamic="force-dynamic";
export async function GET(request:Request){const auth=await requireOwnerApiSession(request);if(!auth.ok)return auth.response;try{return Response.json(await getMarketingOverview(),{headers:{"Cache-Control":"private, no-store"}});}catch(e){return Response.json({error:e instanceof Error?e.message:"Marketing overview failed."},{status:503});}}
