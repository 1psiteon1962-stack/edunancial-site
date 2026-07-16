import { extname } from "node:path";

export async function validateCurriculumFiles(files: Array<{ destination: string; content: string }>) {
  const relevant = files.filter((file) => file.destination.startsWith("content/curriculum/") && extname(file.destination).toLowerCase() === ".md");
  if (relevant.length === 0) {
    return { success: true, warnings: ["No curriculum-bound markdown files required validation."], errors: [] as string[] };
  }

  const validator = await import("../../../scripts/curriculum/lib/validator.mjs");
  const idParser = await import("../../../scripts/curriculum/lib/id-parser.mjs");
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const file of relevant) {
    const match = file.destination.match(/([A-Z]+-L\d-[A-Z0-9-]+)\.md$/);
    const assetId = match?.[1];
    if (!assetId) {
      warnings.push(`${file.destination} does not map to a canonical curriculum asset ID.`);
      continue;
    }
    const parsed = idParser.parseAssetId(assetId);
    if (!parsed.valid) {
      errors.push(`${assetId}: ${parsed.error}`);
      continue;
    }
    const result = validator.validateAsset(file.content, assetId);
    warnings.push(...result.warnings.map((warning: string) => `${assetId}: ${warning}`));
    errors.push(...result.errors.map((error: string) => `${assetId}: ${error}`));
  }

  return { success: errors.length === 0, warnings, errors };
}
