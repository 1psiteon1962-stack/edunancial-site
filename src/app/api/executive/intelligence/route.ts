import { NextResponse } from "next/server";
import { getNeonSql } from "@/lib/db/neon";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";

export async function GET() {
 const session=await getAuthenticatedMemberSession();
 if(!session.authenticated||!session.user) return NextResponse.json({error:"Authentication required."},{status:401});
 const sql=getNeonSql(); if(!sql) return NextResponse.json({events:[],aiInteractions:[],funnel:[],configured:false});
 const [events,ai,funnel]=await Promise.all([
  sql`select event_name,count(*)::int as count from learner_events where occurred_at>=now()-interval '30 days' group by event_name order by count desc`,
  sql`select intent,count(*)::int as count from ai_learning_interactions where created_at>=now()-interval '30 days' group by intent order by count desc`,
  sql`select date_trunc('day',occurred_at) as day,event_name,count(*)::int as count from learner_events where occurred_at>=now()-interval '30 days' and event_name in ('registration','lesson_start','lesson_complete','free_preview_complete','upgrade','cancellation') group by 1,2 order by 1`
 ]);
 return NextResponse.json({events,aiInteractions:ai,funnel,configured:true,windowDays:30});
}
