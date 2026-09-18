import type { AILearningContext } from '@/lib/ai-learning/context';
import { buildAILearningGrounding } from '@/lib/ai-learning/grounding';
import type { JurisdictionRepository } from './engine';
import type { LessonLocalizationContext } from './types';

/**
 * Backward-compatible adapter for callers that still use the older orchestrator.
 * The AI-learning grounding service is the single authority for whether local
 * claims are allowed. This prevents structural jurisdiction validity from being
 * mistaken for verified regulatory grounding.
 */
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
  _now = new Date(),
): Promise<GroundingResult> {
  const grounding = await buildAILearningGrounding({
    repository: repo,
    context: learner,
    message,
  });

  return {
    allowed: grounding.localClaimsAllowed,
    reason: grounding.reason ?? (
      grounding.localization?.requiresHumanReview
        ? 'Verified jurisdiction grounding requires human review before local claims are allowed.'
        : undefined
    ),
    topics: grounding.topics,
    context: grounding.localization ?? undefined,
    prompt: grounding.prompt,
  };
}
