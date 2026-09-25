import { NextResponse } from "next/server";
import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { recordLearnerEvent } from "@/lib/ai-learning/events";

export async function POST(request: Request) {
  const auth=await requireAuthenticatedMemberWrite(request,"learner-event"); if(!auth.ok) return auth.response;
  const body=await request.json() as Record<string,unknown>;
  try {
    await recordLearnerEvent({userId:auth.session.user.id,eventName:String(body.eventName ?? ""),
      lessonId:typeof body.lessonId==="string"?body.lessonId.slice(0,80):null,track:typeof body.track==="string"?body.track.slice(0,16):null,
      level:typeof body.level==="number"?Math.trunc(body.level):null,locale:typeof body.locale==="string"?body.locale.slice(0,24):null,
      metadata:body.metadata && typeof body.metadata==="object"&&!Array.isArray(body.metadata)?body.metadata as Record<string,unknown>:{}});
    return NextResponse.json({success:true});
  } catch { return NextResponse.json({success:false,error:"Invalid learner event."},{status:400}); }
}
