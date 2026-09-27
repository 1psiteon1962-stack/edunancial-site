import { getNeonSql } from '@/lib/db/neon';

export type BlogArticle = {
  id: string; slug: string; locale: string; track: string | null; title: string;
  summary: string; body: string; author: string; published_at: string | null;
};

export async function listPublishedArticles(locale = 'en-US'): Promise<BlogArticle[]> {
  const sql = getNeonSql();
  if (!sql) return [];
  return await sql`
    select id,slug,locale,track,title,summary,body,author,published_at
    from blog_articles where status='published' and locale=${locale}
    order by published_at desc nulls last
  ` as BlogArticle[];
}

export async function getPublishedArticle(slug: string, locale = 'en-US'): Promise<BlogArticle | null> {
  const sql = getNeonSql();
  if (!sql) return null;
  const rows = await sql`
    select id,slug,locale,track,title,summary,body,author,published_at
    from blog_articles where status='published' and slug=${slug} and locale=${locale} limit 1
  ` as BlogArticle[];
  return rows[0] ?? null;
}
