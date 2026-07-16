import { extname } from "node:path";

import type { AcademyLevel, EdunancialPillar, TaxonomySubcategory, TopLevelClassification } from "@/lib/admin-content/types";

const levelPattern = /(?:level|l)[-_ ]?(1|2|3|4|5)/i;

export function classifyFromFilename(filename: string, archivePath: string | null) {
  const haystack = `${filename} ${archivePath ?? ""}`.toLowerCase();
  const extension = extname(filename).toLowerCase();

  let pillar: EdunancialPillar = "uncategorized";
  let subcategory: TaxonomySubcategory = null;
  let category: TopLevelClassification = "uncategorized";
  let academyLevel: AcademyLevel = null;
  const reasons: string[] = [];

  if (/real[- ]estate|property|foreclosure|tax[- ]liens?|tax[- ]deeds?|flipping|creative[- ]financing/.test(haystack)) {
    pillar = "red";
    reasons.push("filename references red pillar topics");
  } else if (/stocks?|options?|bonds?|retirement|paper[- ]assets?|credit/.test(haystack)) {
    pillar = "white";
    reasons.push("filename references white pillar topics");
  } else if (/business|entrepreneurship|profit|margins|ai|artificial[- ]intelligence|operations/.test(haystack)) {
    pillar = "blue";
    reasons.push("filename references blue pillar topics");
  }

  const levelMatch = haystack.match(levelPattern);
  if (levelMatch) {
    academyLevel = `level-${levelMatch[1]}` as AcademyLevel;
    if (pillar === "uncategorized") pillar = "academy";
    reasons.push(`filename references ${academyLevel}`);
  }

  if (/lesson|worksheet|lecture/.test(haystack)) category = "lessons";
  else if (/quiz|exam|assessment|test/.test(haystack)) category = "quizzes";
  else if (/course|module/.test(haystack)) category = "courses";
  else if (/book|guide|manual/.test(haystack)) category = "books";
  else if (/faq/.test(haystack)) category = "frequently-asked-questions";
  else if (/policy|terms|privacy|legal|contract/.test(haystack)) category = "legal";
  else if (/marketing|campaign|sales/.test(haystack)) category = "marketing";
  else if (/social|instagram|facebook|linkedin|youtube|tiktok/.test(haystack)) category = "social-media";
  else if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(extension)) category = "images";
  else if ([".mp3", ".wav", ".m4a"].includes(extension)) category = "audio";
  else if ([".mp4", ".webm"].includes(extension)) category = "video";

  if (/foreclosure/.test(haystack)) subcategory = "foreclosure";
  else if (/tax[- ]liens?/.test(haystack)) subcategory = "tax-liens";
  else if (/tax[- ]deeds?/.test(haystack)) subcategory = "tax-deeds";
  else if (/flipping/.test(haystack)) subcategory = "flipping";
  else if (/creative[- ]financing/.test(haystack)) subcategory = "creative-financing";
  else if (/real[- ]estate|property/.test(haystack)) subcategory = "real-estate";
  else if (/stocks?/.test(haystack)) subcategory = "stocks";
  else if (/options?/.test(haystack)) subcategory = "options";
  else if (/bonds?/.test(haystack)) subcategory = "bonds";
  else if (/retirement/.test(haystack)) subcategory = "retirement";
  else if (/commercial[- ]credit|credit/.test(haystack)) subcategory = "commercial-credit";
  else if (/entrepreneurship/.test(haystack)) subcategory = "entrepreneurship";
  else if (/profit/.test(haystack)) subcategory = "profit";
  else if (/margins?/.test(haystack)) subcategory = "margins";
  else if (/artificial[- ]intelligence|\bai\b/.test(haystack)) subcategory = "artificial-intelligence";
  else if (/operations/.test(haystack)) subcategory = "operations";
  else if (pillar !== "uncategorized") subcategory = "general";

  return { pillar, subcategory, category, academyLevel, reasons };
}
