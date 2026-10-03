import { getNeonSql } from "@/lib/db/neon";

export type MarketingOverview = {
  campaigns: number; review: number; approved: number; scheduled: number; published: number; failed: number;
  pending: Array<{ id:string; platform:string; format:string; copy:string; scheduledFor:string|null; campaign:string; locale:string; status:string }>;
};

export async function getMarketingOverview(): Promise<MarketingOverview> {
  const sql=getNeonSql(); if(!sql) throw new Error("Marketing control plane requires DATABASE_URL or NETLIFY_DATABASE_URL.");
  const [campaignRows,statusRows,pendingRows]=await Promise.all([
    sql`select count(*)::int as count from marketing_campaigns where status <> 'complete'`,
    sql`select status,count(*)::int as count from marketing_publications group by status`,
    sql`select p.id,p.platform,p.format,p.platform_copy,p.scheduled_for,p.status,c.locale,mc.name as campaign
        from marketing_publications p join marketing_content c on c.id=p.content_id join marketing_campaigns mc on mc.id=c.campaign_id
        where p.status in ('review','approved','scheduled','failed')
        order by p.created_at asc limit 100`
  ]);
  const counts=new Map(statusRows.map(row=>[String(row.status),Number(row.count??0)]));
  return {campaigns:Number(campaignRows[0]?.count??0),review:counts.get("review")??0,approved:counts.get("approved")??0,
    scheduled:counts.get("scheduled")??0,published:counts.get("published")??0,failed:counts.get("failed")??0,
    pending:pendingRows.map(row=>({id:String(row.id),platform:String(row.platform),format:String(row.format),copy:String(row.platform_copy),
      scheduledFor:row.scheduled_for?String(row.scheduled_for):null,campaign:String(row.campaign),locale:String(row.locale),status:String(row.status)}))};
}

export async function approveMarketingPublication(publicationId:string,actor:string){
 const sql=getNeonSql(); if(!sql) throw new Error("Marketing control plane requires a database connection.");
 const rows=await sql`update marketing_publications set status='approved',last_error=null,updated_at=now()
   where id=${publicationId} and status in ('review','failed') returning id`;
 if(rows.length!==1) throw new Error("Publication is not awaiting approval.");
 await sql`insert into marketing_publish_events(publication_id,event_type,detail) values(${publicationId},'approved',${JSON.stringify({actor})}::jsonb)`;
 return {id:publicationId,status:"approved" as const};
}

export async function scheduleMarketingPublication(publicationId:string,scheduledFor:string,actor:string){
 const when=new Date(scheduledFor); if(!Number.isFinite(when.getTime())||when.getTime()<=Date.now()) throw new Error("A valid future schedule time is required.");
 const sql=getNeonSql(); if(!sql) throw new Error("Marketing control plane requires a database connection.");
 const rows=await sql`update marketing_publications set status='scheduled',scheduled_for=${when.toISOString()},last_error=null,updated_at=now()
   where id=${publicationId} and status='approved' returning id`;
 if(rows.length!==1) throw new Error("Only an approved publication can be scheduled.");
 await sql`insert into marketing_publish_events(publication_id,event_type,detail) values(${publicationId},'scheduled',${JSON.stringify({actor,scheduledFor:when.toISOString()})}::jsonb)`;
 return {id:publicationId,status:"scheduled" as const,scheduledFor:when.toISOString()};
}
