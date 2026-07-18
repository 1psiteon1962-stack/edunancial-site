import { extname } from "node:path";

import type { AcademyLevel, ClassificationProposal, TopLevelClassification, UploadDestination } from "@/lib/admin-content/types";
import { slugify } from "@/lib/admin-content/utils";

function levelFolder(level: AcademyLevel) {
  return level ? `L${level.replace("level-", "")}` : null;
}

function toMarketplaceCategory(category: TopLevelClassification) {
  switch (category) {
    case "books":
      return "books";
    case "courses":
    case "lessons":
    case "quizzes":
    case "certificates":
      return "courses";
    case "membership":
      return "software";
    case "marketing":
    case "social-media":
      return "templates";
    case "audio":
    case "video":
    case "images":
      return "downloads";
    default:
      return "other-digital-products";
  }
}

function toResourcesCategory(category: TopLevelClassification) {
  if (category === "frequently-asked-questions") return "faq";
  if (category === "legal") return "legal";
  if (category === "translations") return "translations";
  if (category === "marketing" || category === "social-media") return "templates";
  return "general";
}

export function buildDestination(
  proposal: Omit<ClassificationProposal, "destination">,
  normalizedFilename: string,
  uploadDestination: UploadDestination = "courses",
) {
  const extension = extname(normalizedFilename).toLowerCase();
  const slug = slugify(normalizedFilename.replace(extension, ""));
  const level = levelFolder(proposal.academyLevel);

  if (uploadDestination === "marketplace") {
    return `data/marketplace/${toMarketplaceCategory(proposal.category)}/${proposal.language}/${slug}${extension}`;
  }

  if (uploadDestination === "library") {
    return `data/library/${proposal.category}/${proposal.language}/${slug}${extension}`;
  }

  if (uploadDestination === "blog") {
    return `data/blog/${proposal.language}/${slug}${extension}`;
  }

  if (uploadDestination === "news") {
    return `data/news/${proposal.language}/${slug}${extension}`;
  }

  if (uploadDestination === "resources") {
    return `data/resources/${toResourcesCategory(proposal.category)}/${proposal.language}/${slug}${extension}`;
  }

  if (["lessons", "quizzes", "courses", "certificates"].includes(proposal.category) && level && ["red", "white", "blue"].includes(proposal.pillar)) {
    return `content/curriculum/${proposal.pillar.toUpperCase()}/${level}/${slug}${extension}`;
  }

  if (proposal.category === "legal") {
    return `data/content/legal/${proposal.language}/${slug}${extension}`;
  }

  if (proposal.category === "images" || proposal.category === "audio" || proposal.category === "video") {
    return `assets/uploads/${proposal.category}/${proposal.language}/${slug}${extension}`;
  }

  return `curriculum/staging/content-upload/${proposal.category}/${proposal.language}/${slug}${extension}`;
}
