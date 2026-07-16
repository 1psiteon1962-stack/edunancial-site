import type { ClassificationProposal, ExtractedFile, TaxonomySubcategory, TopLevelClassification } from "@/lib/admin-content/types";

import { buildDestination } from "@/lib/admin-content/classification/destination-rules";
import { classifyFromContent, detectLanguage } from "@/lib/admin-content/classification/content-rules";
import { classifyFromFilename } from "@/lib/admin-content/classification/filename-rules";

export function classifyFile(input: Pick<ExtractedFile, "normalizedFilename" | "archivePath" | "previewText" | "rawText">): ClassificationProposal {
  const filenameBased = classifyFromFilename(input.normalizedFilename, input.archivePath);
  const contentReasons = classifyFromContent(input.rawText || input.previewText);
  const language = detectLanguage(`${input.normalizedFilename} ${input.previewText} ${input.rawText}`);
  const category = filenameBased.category as TopLevelClassification;
  const subcategory = filenameBased.subcategory as TaxonomySubcategory;
  const pillar = filenameBased.pillar;
  const academyLevel = filenameBased.academyLevel;
  const reasons = [...filenameBased.reasons, ...contentReasons];
  const confidence = Math.min(0.99, 0.35 + reasons.length * 0.18 + (pillar !== "uncategorized" ? 0.14 : 0));
  const destination = buildDestination(
    {
      category,
      subcategory,
      language,
      academyLevel,
      confidence,
      reasons,
      pillar,
    },
    input.normalizedFilename,
  );

  return {
    category,
    subcategory,
    language,
    academyLevel,
    destination,
    confidence,
    reasons: reasons.length > 0 ? reasons : ["defaulted to uncategorized ruleset"],
    pillar,
  };
}
