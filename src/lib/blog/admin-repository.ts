import { getNeonSql } from "@/lib/db/neon";
import type { BlogArticlePackage } from "./article-package";

export async function listAdminBlogArticles() {
  const sql=getNeonSql(); if(!sql) return [];
  return await sql`select id,slug,locale,track,title,status,version,verification_status,scheduled_for,published_at,updated_at from blog_articles order by updated_at desc limit 200`;
}

export async function createBlogDraft(p: BlogArticlePackage, actor: string) {
  const sql=getNeonSql(); if(!sql) throw new Error("Blog database is unavailable.");
  const articles=await sql`insert into blog_articles(slug,locale,track,title,summary,body,author,seo_title,seo_description,status,version,content_scope,target_country,target_region,updated_at)
      values(${p.slug},${p.locale},${p.track},${p.title},${p.summary},${p.body},${p.author},${p.seo.title??null},${p.seo.description??null},'draft',1,${p.contentScope},${p.targetCountry??null},${p.targetRegion??null},now()) returning id`;
  const articleId=String(articles[0].id);
  const revisions=await sql`insert into blog_article_revisions(article_id,version,title,summary,body,author,seo_title,seo_description,sources,provenance,created_by)
      values(${articleId},1,${p.title},${p.summary},${p.body},${p.author},${p.seo.title??null},${p.seo.description??null},${JSON.stringify(p.sources)}::jsonb,${JSON.stringify(p.provenance)}::jsonb,${actor}) returning id`;
  const revisionId=String(revisions[0].id);
  await sql`update blog_articles set current_revision_id=${revisionId} where id=${articleId}`;
  await sql`insert into blog_article_audit_log(article_id,revision_id,action,actor_type,actor_id,details) values(${articleId},${revisionId},'draft_created','human',${actor},'{}'::jsonb)`;
  return {articleId,revisionId};
}

export async function approveCurrentRevision(articleId:string, actor:string) {
  const sql=getNeonSql(); if(!sql) throw new Error("Blog database is unavailable.");
  const rows=await sql`select current_revision_id from blog_articles where id=${articleId} for update`;
    if(!rows[0]?.current_revision_id) throw new Error("Article has no current revision.");
  const revisionId=String(rows[0].current_revision_id);
  await sql`update blog_article_approvals set revoked_at=now() where article_id=${articleId} and revoked_at is null`;
  await sql`insert into blog_article_approvals(article_id,revision_id,approved_by) values(${articleId},${revisionId},${actor})`;
  await sql`update blog_articles set approved_revision_id=${revisionId},status='approved',updated_at=now() where id=${articleId}`;
  await sql`insert into blog_article_audit_log(article_id,revision_id,action,actor_type,actor_id,details) values(${articleId},${revisionId},'approved','human',${actor},'{}'::jsonb)`;
  return {articleId,revisionId};
}
