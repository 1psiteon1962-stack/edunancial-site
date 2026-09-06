import type { AuthoritySource, JurisdictionRule, JurisdictionSelection, LessonLocalizationContext } from './types';

export interface JurisdictionRepository {
  findRules(input: { jurisdiction: string; subdivisionCode?: string; topics: string[]; asOf: string }): Promise<JurisdictionRule[]>;
  findSources(ids: string[]): Promise<AuthoritySource[]>;
}

const jurisdictionKey = (selection: JurisdictionSelection) =>
  selection.subdivisionCode ? `${selection.countryCode}-${selection.subdivisionCode}` : selection.countryCode;

export async function buildLessonLocalizationContext(
  repo: JurisdictionRepository,
  lessonId: string,
  topics: string[],
  selection: JurisdictionSelection,
  now = new Date()
): Promise<LessonLocalizationContext> {
  const asOf = now.toISOString();
  const rules = await repo.findRules({ jurisdiction: selection.countryCode, subdivisionCode: selection.subdivisionCode, topics, asOf });
  const usableRules = rules.filter(rule =>
    rule.verificationStatus === 'verified' && rule.confidence >= 0.85 &&
    (!rule.effectiveFrom || rule.effectiveFrom <= asOf) && (!rule.effectiveTo || rule.effectiveTo > asOf)
  );
  const sourceIds = [...new Set(usableRules.flatMap(rule => rule.sourceIds))];
  const sources = await repo.findSources(sourceIds);
  const sourceMap = new Map(sources.map(source => [source.id, source]));
  const groundedRules = usableRules.filter(rule => rule.sourceIds.length > 0 && rule.sourceIds.every(id => sourceMap.has(id)));
  const requiresHumanReview = groundedRules.some(rule => rule.risk !== 'green') || rules.some(rule => rule.verificationStatus === 'conflict') || groundedRules.length === 0;
  return { lessonId, selection, topics, rules: groundedRules, sources: groundedRules.length ? sources : [], generatedAt: asOf, requiresHumanReview };
}

export function buildJurisdictionPrompt(context: LessonLocalizationContext): string {
  const key = jurisdictionKey(context.selection);
  if (!context.rules.length) {
    return `Jurisdiction: ${key}. No verified jurisdiction-specific rules are available for these lesson topics. Teach only general educational principles. Do not infer, invent, or translate US law into local law. Clearly state that jurisdiction-specific treatment is unavailable and requires verification.`;
  }
  const rules = context.rules.map(rule => `- ${rule.statement} [sources: ${rule.sourceIds.join(', ')}]`).join('\n');
  return [
    `Jurisdiction: ${key}`,
    `Language: ${context.selection.language}`,
    'Use the verified jurisdiction rules below for jurisdiction-sensitive statements.',
    'Do not substitute US/common-law rules unless the selected jurisdiction is the United States and the source supports them.',
    'Distinguish universal financial principles from jurisdiction-specific tax/legal rules.',
    'If sources conflict or the requested conclusion exceeds the verified material, say so and escalate rather than guessing.',
    rules,
  ].join('\n');
}
