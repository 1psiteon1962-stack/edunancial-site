import { extname } from "node:path";

import type { AcademyLevel, ClassificationProposal } from "@/lib/admin-content/types";
import { slugify } from "@/lib/admin-content/utils";

function levelFolder(level: AcademyLevel) {
  return level ? `L${level.replace("level-", "")}` : null;
}

export function buildDestination(proposal: Omit<ClassificationProposal, "destination">, normalizedFilename: string) {
  const extension = extname(normalizedFilename).toLowerCase();
  const slug = slugify(normalizedFilename.replace(extension, ""));
  const level = levelFolder(proposal.academyLevel);

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
