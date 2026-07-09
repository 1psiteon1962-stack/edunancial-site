import type { AIReviewItem, ContentArticle } from "@/lib/content/types";

function joinList(values: string[]): string {
  return values.join(", ");
}

export function generateAISuggestions(
  article: ContentArticle,
  internalLinkSlugs: string[]
): AIReviewItem[] {
  const outline = article.sections
    .map((section, index) => `${index + 1}. ${section.heading}`)
    .join("\n");

  const primaryKeyword = article.seo.keywords[0] ?? article.tags[0] ?? article.categorySlug;
  const readabilityTips = [
    "Keep paragraphs to three sentences or fewer for mobile readability.",
    "Define the primary entity before introducing supporting examples.",
    "Use one action-oriented takeaway near the top of the article.",
  ].join(" ");

  const grammarNotes = [
    "Check for repeated financial jargon in back-to-back sentences.",
    "Prefer active voice in each section summary.",
    "Verify that disclaimer language stays educational rather than advisory.",
  ].join(" ");

  const summary = `${article.title} helps ${article.audience.join(", ")} understand ${joinList(
    article.entityHighlights.slice(0, 3)
  )} through a structured educational workflow.`;

  return [
    {
      id: `${article.id}-outline`,
      type: "outline",
      title: "Article outline",
      summary: "AI-generated section outline for editorial review.",
      content: outline,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-seo`,
      type: "seoRecommendations",
      title: "SEO recommendations",
      summary: "Keyword, entity, and crawler-focused recommendations.",
      content: `Lead with the entity \"${primaryKeyword}\" in the first 120 words, keep headings aligned to ${joinList(
        article.entityHighlights.slice(0, 3)
      )}, and reinforce the ${article.clusterSlug.replace(/-/g, " ")} topical cluster with one internal link above the fold.`,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-readability`,
      type: "readabilityAnalysis",
      title: "Readability analysis",
      summary: "Deterministic readability guidance based on article structure.",
      content: `${article.sections.length} primary sections detected. ${readabilityTips}`,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-grammar`,
      type: "grammarSuggestions",
      title: "Grammar suggestions",
      summary: "Human-review grammar checklist.",
      content: grammarNotes,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-links`,
      type: "internalLinkSuggestions",
      title: "Internal link suggestions",
      summary: "Related internal links that strengthen topical authority.",
      content:
        internalLinkSlugs.length > 0
          ? internalLinkSlugs.map((slug) => `/blog/${slug}`).join("\n")
          : "No related article candidates available yet.",
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-meta-title`,
      type: "metaTitle",
      title: "Meta title",
      summary: "Candidate title tag for search results.",
      content: article.seo.metaTitle,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-meta-description`,
      type: "metaDescription",
      title: "Meta description",
      summary: "Candidate meta description for search snippets.",
      content: article.seo.metaDescription,
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-faq`,
      type: "faqGeneration",
      title: "FAQ generation",
      summary: "Reviewable Q&A block aligned to featured entities.",
      content: article.faq.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n"),
      status: "pending",
      editable: true,
    },
    {
      id: `${article.id}-summary`,
      type: "contentSummary",
      title: "Content summary",
      summary: "AI-generated article summary.",
      content: summary,
      status: "pending",
      editable: true,
    },
  ];
}
