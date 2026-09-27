import { getNeonSql } from '@/lib/db/neon';

export async function queueBlogForMarketing(articleId: string, campaignId: string) {
  const sql = getNeonSql();
  if (!sql) throw new Error('Database unavailable');

  const articles = await sql`select id,title,summary,slug,locale from blog_articles where id=${articleId} and status in ('approved','scheduled','published') limit 1`;
  const article = articles[0];
  if (!article) throw new Error('Blog article must be approved before marketing derivatives are queued.');

  const content = await sql`
    insert into marketing_content(campaign_id,source_type,source_ref,locale,canonical_message,status)
    values(${campaignId},'blog',${articleId},${article.locale},${article.title + '\n\n' + article.summary},'review')
    returning id
  `;
  const contentId = content[0].id as string;

  const platforms = await sql`select key from marketing_platforms where enabled=true order by key`;
  for (const row of platforms) {
    const platform = String(row.key);
    await sql`
      insert into marketing_publications(content_id,platform,format,platform_copy,status)
      values(${contentId},${platform},'post',${article.summary + ' /blog/' + article.slug},'review')
      on conflict(content_id,platform,format) do nothing
    `;
  }
  return contentId;
}
