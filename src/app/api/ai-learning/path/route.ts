import { NextResponse } from "next/server";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";
import { getLearnerAIPreferences } from "@/lib/ai-learning/preferences";
import { LEARNING_GOALS } from "@/lib/ai-learning/goals";

export async function GET() {
 const session=await getAuthenticatedMemberSession();
 if(!session.authenticated||!session.user) return NextResponse.json({error:"Authentication required."},{status:401});
 const prefs=await getLearnerAIPreferences(session.user.id);
 const goals=(prefs?.learningGoals??[]).map(id=>LEARNING_GOALS.find(g=>g.id===id)).filter(Boolean);
 const tracks=[...new Set(goals.flatMap(g=>g?.suggestedTracks??[]))];
 return NextResponse.json({goals,tracks,membershipTier:session.user.membershipTier,principle:"Suggested learning sequence only; the learner makes financial decisions."});
}
