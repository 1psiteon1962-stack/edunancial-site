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

const PUBLIC_COLUMNS = "id,slug,locale,translation_group_id,track,title,summary,body,author,seo_title,seo_description,published_at";

export async function listPublishedArticles(locale = "en-US"): Promise<BlogArticle[]> {
  const sql = getNeonSql();
  if (!sql) return [];
  return await sql(
    `select ${PUBLIC_COLUMNS} from blog_articles where status='published' and locale=$1 order by published_at desc nulls last`,
    [locale],
  ) as BlogArticle[];
}

export async function getPublishedArticle(slug: string, locale = "en-US"): Promise<BlogArticle | null> {
  const sql = getNeonSql();
  if (!sql) return null;
  const rows = await sql(
    `select ${PUBLIC_COLUMNS} from blog_articles where status='published' and slug=$1 and locale=$2 limit 1`,
    [slug, locale],
  ) as BlogArticle[];
  return rows[0] ?? null;
}

export async function listPublishedTranslations(translationGroupId: string): Promise<Array<Pick<BlogArticle, "slug" | "locale">>> {
  const sql = getNeonSql();
  if (!sql) return [];
  return await sql(
    "select slug,locale from blog_articles where status='published' and translation_group_id=$1 order by locale",
    [translationGroupId],
  ) as Array<Pick<BlogArticle, "slug" | "locale">>;
}
