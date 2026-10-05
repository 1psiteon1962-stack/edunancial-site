import { getNeonSql } from "@/lib/db/neon";

export type FunnelStage="targeting"|"message"|"handoff"|"conversion"|"retention";
export type FunnelEventInput={campaignId:string;contentId?:string;publicationId?:string;stage:FunnelStage;eventType:string;subjectKey?:string;market?:string;locale?:string;platform?:string;value?:number;metadata?:Record<string,unknown>};

export async function recordMarketingFunnelEvent(input:FunnelEventInput){
 const sql=getNeonSql();if(!sql)throw new Error("Marketing funnel telemetry requires a database connection.");
 await sql`insert into marketing_funnel_events(campaign_id,content_id,publication_id,stage,event_type,subject_key,market,locale,platform,value,metadata)
 values(${input.campaignId},${input.contentId??null},${input.publicationId??null},${input.stage},${input.eventType},${input.subjectKey??null},${input.market??null},${input.locale??null},${input.platform??null},${input.value??null},${JSON.stringify(input.metadata??{})}::jsonb)`;
}

export async function getCampaignFunnelCounts(campaignId:string,since:string){
 const sql=getNeonSql();if(!sql)throw new Error("S8 diagnostics require a database connection.");
 return sql`select stage,event_type,count(*)::int as count,coalesce(sum(value),0)::float as value from marketing_funnel_events where campaign_id=${campaignId} and occurred_at>=${since} group by stage,event_type order by stage,event_type`;
}

export function diagnoseFunnel(counts:Record<string,number>){
 const impressions=counts.impression??0,engagements=counts.engagement??0,clicks=counts.click??0,leads=counts.lead??0,registrations=counts.registration??0,paid=counts.paid_conversion??0,retained=counts.retained??0;
 if(impressions<100)return{stage:"insufficient_data",reason:"Not enough impressions to diagnose reliably."};
 if(engagements/impressions<0.01)return{stage:"targeting",reason:"Audience is not engaging with distribution."};
 if(clicks/Math.max(engagements,1)<0.05)return{stage:"message",reason:"Engaged audience is not taking the message CTA."};
 if(registrations/Math.max(leads||clicks,1)<0.15)return{stage:"handoff",reason:"Interest is being lost between response and registration."};
 if(paid/Math.max(registrations,1)<0.03)return{stage:"conversion",reason:"Registered prospects are not converting to paid."};
 if(paid>=10&&retained/paid<0.6)return{stage:"retention",reason:"Paid customers are not retaining at the expected level."};
 return{stage:"healthy",reason:"No dominant funnel leak detected."};
}

export async function runAndPersistS8Diagnosis(campaignId:string,since:string){
 const rows=await getCampaignFunnelCounts(campaignId,since);const counts:Record<string,number>={};
 for(const row of rows)counts[String(row.event_type)]=(counts[String(row.event_type)]??0)+Number(row.count??0);
 const diagnosis=diagnoseFunnel(counts);const sql=getNeonSql();if(!sql)throw new Error("S8 diagnostics require a database connection.");
 const now=new Date().toISOString();
 await sql`insert into marketing_s8_diagnostics(campaign_id,window_starts_at,window_ends_at,diagnosed_stage,confidence,evidence,recommended_action)
 values(${campaignId},${since},${now},${diagnosis.stage},${diagnosis.stage==="insufficient_data"?0.25:0.75},${JSON.stringify({counts,reason:diagnosis.reason})}::jsonb,${JSON.stringify({policy:"diagnose-before-spend",stage:diagnosis.stage})}::jsonb)`;
 return{campaignId,since,through:now,counts,...diagnosis};
}
