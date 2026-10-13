import { getNeonSql } from "@/lib/db/neon";

export type BlogArticle = {
  id: string;
  slug: string;
  locale: string;
  translation_group_id: string;
  track: string | null;
  title: string;
  summary: string;
  body: string;
  author: string;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};


// A newly deployed blog may precede its additive database migration.
// Fail closed for that *specific* PostgreSQL error; surface all other DB errors.
function isMissingBlogTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: unknown; cause?: unknown };
  return value.code === "42P01" || (value.cause !== error && isMissingBlogTable(value.cause));
}

async function withMissingTableFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (!isMissingBlogTable(error)) throw error;
    console.warn("blog: publication tables are not yet configured");
    return fallback;
  }
}

export async function listPublishedArticles(locale = "en-US"): Promise<BlogArticle[]> {
  const sql = getNeonSql();
  if (!sql) return [];
  return await withMissingTableFallback(async () => sql`
    select id,slug,locale,translation_group_id,track,title,summary,body,author,seo_title,seo_description,published_at
    from blog_articles where status='published' and locale=${locale}
    order by published_at desc nulls last
  ` as BlogArticle[], []);
}

export async function getPublishedArticle(slug: string, locale = "en-US"): Promise<BlogArticle | null> {
  const sql = getNeonSql();
  if (!sql) return null;
  const rows = await withMissingTableFallback(async () => sql`
    select id,slug,locale,translation_group_id,track,title,summary,body,author,seo_title,seo_description,published_at
    from blog_articles where status='published' and slug=${slug} and locale=${locale} limit 1
  ` as BlogArticle[], []);
  return rows[0] ?? null;
}

export async function listPublishedTranslations(translationGroupId: string): Promise<Array<Pick<BlogArticle, "slug" | "locale">>> {
  const sql = getNeonSql();
  if (!sql) return [];
  return await withMissingTableFallback(async () => sql`
    select slug,locale from blog_articles where status='published' and translation_group_id=${translationGroupId}
    order by locale
  ` as Array<Pick<BlogArticle, "slug" | "locale">>, []);
}
