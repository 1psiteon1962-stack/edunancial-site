import { NextResponse } from "next/server";
import { getAuthenticatedMemberSession, requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { normalizeLearningGoals } from "@/lib/ai-learning/goals";
import { getLearnerAIPreferences, upsertLearnerAIPreferences } from "@/lib/ai-learning/preferences";

export async function GET() {
  const session=await getAuthenticatedMemberSession();
  if(!session.authenticated || !session.user) return NextResponse.json({error:"Authentication required."},{status:401});
  return NextResponse.json({preferences: await getLearnerAIPreferences(session.user.id)});
}
export async function PUT(request: Request) {
  const auth=await requireAuthenticatedMemberWrite(request,"ai-preferences"); if(!auth.ok) return auth.response;
  const body=await request.json() as Record<string,unknown>;
  const value={countryCode:typeof body.countryCode==="string"?body.countryCode.slice(0,12):null,
    jurisdictionCode:typeof body.jurisdictionCode==="string"?body.jurisdictionCode.slice(0,24):null,
    preferredLanguage:typeof body.preferredLanguage==="string"?body.preferredLanguage.slice(0,24):"en",
    learningGoals:normalizeLearningGoals(body.learningGoals), aiAssistanceEnabled:body.aiAssistanceEnabled!==false};
  await upsertLearnerAIPreferences(auth.session.user.id,value); return NextResponse.json({preferences:value});
}
