import { isValidBlogLocale } from "./locale";

export const BLOG_TRACKS = ["red","white","blue","green","gold","purple","orange","black"] as const;
export type BlogTrack = typeof BLOG_TRACKS[number];
export type ContentScope = "global" | "regional" | "country";

export type BlogArticlePackage = {
  schemaVersion: 1;
  slug: string;
  locale: string;
  title: string;
  summary: string;
  body: string;
  author: string;
  track: BlogTrack;
  tags: string[];
  contentScope: ContentScope;
  targetCountry?: string;
  targetRegion?: string;
  sources: Array<{ url: string; title: string; accessedAt?: string }>;
  provenance: { provider: "openai" | "anthropic" | "human"; model?: string; createdAt: string };
  seo: { title?: string; description?: string };
};

export function validateBlogArticlePackage(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object") return ["package must be an object"];
  const p = value as Partial<BlogArticlePackage>;
  if (p.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (!p.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) errors.push("slug must be lowercase kebab-case");
  if (!p.locale || !isValidBlogLocale(p.locale)) errors.push("locale is not supported");
  if (!p.title?.trim()) errors.push("title is required");
  if (!p.summary?.trim()) errors.push("summary is required");
  if (!p.body?.trim()) errors.push("body is required");
  if (!p.author?.trim()) errors.push("author is required");
  if (!p.track || !(BLOG_TRACKS as readonly string[]).includes(p.track)) errors.push("track is invalid");
  if (!Array.isArray(p.tags)) errors.push("tags must be an array");
  if (!p.contentScope || !["global","regional","country"].includes(p.contentScope)) errors.push("contentScope is invalid");
  if (p.contentScope === "country" && !p.targetCountry) errors.push("country content requires targetCountry");
  if (p.contentScope === "regional" && !p.targetRegion) errors.push("regional content requires targetRegion");
  if (!Array.isArray(p.sources)) errors.push("sources must be an array");
  if (!p.provenance?.provider || !["openai","anthropic","human"].includes(p.provenance.provider)) errors.push("provenance.provider is invalid");
  if (!p.provenance?.createdAt) errors.push("provenance.createdAt is required");
  return errors;
}
