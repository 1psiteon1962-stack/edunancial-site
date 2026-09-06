import type { AILearningContext } from './context';
import { buildJurisdictionPrompt, buildLessonLocalizationContext, type JurisdictionRepository } from '@/lib/jurisdiction/engine';
import { evaluateJurisdictionSelection } from '@/lib/jurisdiction/policy';
import { inferJurisdictionTopics } from '@/lib/jurisdiction/topics';
import type { LessonLocalizationContext } from '@/lib/jurisdiction/types';

export interface AILearningGrounding {
  topics: string[];
  prompt: string;
  localization: LessonLocalizationContext | null;
  localClaimsAllowed: boolean;
  reason?: string;
}

export async function buildAILearningGrounding(input: {
  repository: JurisdictionRepository;
  context: AILearningContext;
  message: string;
}): Promise<AILearningGrounding> {
  const topics = inferJurisdictionTopics({
    track: input.context.track,
    lessonId: input.context.lessonId,
    topic: input.context.topic,
    message: input.message,
  });

  const policy = evaluateJurisdictionSelection({
    countryCode: input.context.country,
    subdivisionCode: input.context.subdivisionCode,
    language: input.context.language,
    taxResidenceCountryCode: input.context.taxResidenceCountryCode,
    assetCountryCode: input.context.assetCountryCode,
    businessCountryCode: input.context.businessCountryCode,
  }, topics);

  if (!policy.usable) {
    return {
      topics,
      localization: null,
      localClaimsAllowed: false,
      reason: policy.reason,
      prompt: [
        `Selected jurisdiction: ${policy.selection.countryCode}${policy.selection.subdivisionCode ? `-${policy.selection.subdivisionCode}` : ''}.`,
        policy.reason ?? 'Jurisdiction information is incomplete.',
        'Teach universal educational principles only.',
        'Do not make jurisdiction-specific legal, tax, regulatory, employment, or property claims until the required jurisdiction is selected and verified.',
      ].join('\n'),
    };
  }

  const localization = await buildLessonLocalizationContext(
    input.repository,
    input.context.lessonId ?? 'GENERAL',
    topics,
    policy.selection,
  );

  return {
    topics,
    localization,
    localClaimsAllowed: localization.rules.length > 0 && !localization.requiresHumanReview,
    reason: localization.rules.length === 0 ? 'No verified jurisdiction-specific rules are available.' : undefined,
    prompt: buildJurisdictionPrompt(localization),
  };
}
