import { getNeonSql } from "@/lib/db/neon";

export async function publishDueBlogArticles(now=new Date()){
 const sql=getNeonSql(); if(!sql) return {published:0};
 const due=await sql`select id,current_revision_id,approved_revision_id from blog_articles where status='scheduled' and scheduled_for<=${now.toISOString()} order by scheduled_for limit 100`;
 let published=0;
 for(const row of due){
   if(!row.current_revision_id||row.current_revision_id!==row.approved_revision_id) continue;
   const approvals=await sql`select 1 from blog_article_approvals where article_id=${row.id} and revision_id=${row.approved_revision_id} and revoked_at is null limit 1`;
   if(!approvals.length) continue;
   const changed=await sql`update blog_articles set status='published',published_at=coalesce(published_at,now()),published_revision_id=approved_revision_id,verification_status='pending',updated_at=now() where id=${row.id} and status='scheduled' and current_revision_id=approved_revision_id returning id`;
   if(changed.length){published++;await sql`insert into blog_article_audit_log(article_id,revision_id,action,actor_type,actor_id,details) values(${row.id},${row.approved_revision_id},'published','system','scheduler','{}'::jsonb)`;}
 }
 return {published};
}

export async function verifyPublishedBlogArticles(origin="https://edunancial.com"){
 const sql=getNeonSql(); if(!sql) return {verified:0,failed:0};
 const rows=await sql`select id,slug,locale,published_revision_id from blog_articles where status='published' and verification_status in ('pending','failed') order by published_at desc limit 100`;
 let verified=0,failed=0;
 for(const row of rows){
   const path=row.locale==="en-US"?`/blog/${row.slug}`:`/blog/${String(row.locale).toLowerCase()}/${row.slug}`;
   let ok=false; try{const response=await fetch(origin+path,{redirect:"follow",cache:"no-store"});ok=response.ok;}catch{}
   await sql`update blog_articles set verification_status=${ok?"verified":"failed"},verified_at=${ok?new Date().toISOString():null},updated_at=now() where id=${row.id}`;
   await sql`insert into blog_article_audit_log(article_id,revision_id,action,actor_type,actor_id,details) values(${row.id},${row.published_revision_id},${ok?"verified":"verification_failed"},'system','verifier',${JSON.stringify({path})}::jsonb)`;
   ok?verified++:failed++;
 }
 return {verified,failed};
}
