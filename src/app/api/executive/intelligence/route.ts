import { NextResponse } from "next/server";
import { getNeonSql } from "@/lib/db/neon";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";

export async function GET() {
  const session=await getAuthenticatedMemberSession();
  if(!session.authenticated || !session.user) return NextResponse.json({error:"Authentication required."},{status:401});
  // Existing admin authorization remains the gate for surfacing this route in the executive UI.
  const sql=getNeonSql(); if(!sql) return NextResponse.json({events:[],aiInteractions:[],configured:false});
  const [events,ai]=await Promise.all([
    sql`select event_name,count(*)::int as count from learner_events where occurred_at >= now()-interval '30 days' group by event_name order by count desc`,
    sql`select intent,count(*)::int as count from ai_learning_interactions where created_at >= now()-interval '30 days' group by intent order by count desc`
  ]);
  return NextResponse.json({events,aiInteractions:ai,configured:true,windowDays:30});
}
