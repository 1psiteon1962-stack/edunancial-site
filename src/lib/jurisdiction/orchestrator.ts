import type { AILearningContext } from '@/lib/ai-learning/context';
import { buildJurisdictionPrompt, buildLessonLocalizationContext, type JurisdictionRepository } from './engine';
import { evaluateJurisdictionSelection } from './policy';
import { inferJurisdictionTopics } from './topics';
import type { JurisdictionSelection, LessonLocalizationContext } from './types';

export interface GroundingResult {
  allowed: boolean;
  reason?: string;
  topics: string[];
  context?: LessonLocalizationContext;
  prompt: string;
}

export async function groundAILearningRequest(
  repo: JurisdictionRepository,
  learner: AILearningContext,
  message: string,
  now = new Date(),
): Promise<GroundingResult> {
  const topics = inferJurisdictionTopics({
    track: learner.track,
    lessonId: learner.lessonId,
    topic: learner.topic,
    message,
  });
  const selection: JurisdictionSelection = {
    countryCode: learner.jurisdiction,
    subdivisionCode: learner.subdivisionCode,
    language: learner.language,
    taxResidenceCountryCode: learner.taxResidenceCountryCode,
    assetCountryCode: learner.assetCountryCode,
    businessCountryCode: learner.businessCountryCode,
  };
  const policy = evaluateJurisdictionSelection(selection, topics);
  if (!policy.usable) {
    return {
      allowed: false,
      reason: policy.reason,
      topics,
      prompt: `Jurisdiction-specific teaching is blocked: ${policy.reason ?? 'jurisdiction selection is incomplete'}`,
    };
  }
  const context = await buildLessonLocalizationContext(
    repo,
    learner.lessonId ?? 'GENERAL',
    topics,
    policy.selection,
    now,
  );
  return { allowed: true, topics, context, prompt: buildJurisdictionPrompt(context) };
}
