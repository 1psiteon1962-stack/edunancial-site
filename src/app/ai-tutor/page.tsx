import type { Metadata } from "next";
import AITutorDashboard from "@/components/ai/AITutorDashboard";
import {
  buildMemberContext,
  getRecommendedCourses,
  getRecommendedCalculators,
  generateLearningPath,
  getSuggestedQuestions,
} from "@/lib/ai-tutor";

export const metadata: Metadata = {
  title: "AI Financial Tutor | Edunancial",
  description:
    "Your personalized AI-powered financial education tutor. Ask questions, follow your learning path, and build real financial competency.",
};

export default function AITutorPage() {
  // In production: pass authenticated userId from session/cookie
  const memberContext = buildMemberContext();

  const recommendedCourses = getRecommendedCourses(memberContext, 4);
  const recommendedCalculators = getRecommendedCalculators(memberContext, 3);
  const learningPath = generateLearningPath(memberContext);
  const suggestedQuestions = getSuggestedQuestions(memberContext);

  return (
    <AITutorDashboard
      memberContext={memberContext}
      recommendedCourses={recommendedCourses}
      recommendedCalculators={recommendedCalculators}
      learningPath={learningPath}
      suggestedQuestions={suggestedQuestions}
    />
  );
}
