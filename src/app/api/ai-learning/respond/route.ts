import { NextResponse } from "next/server";

import { mergeAILearningConfig, type AILearningAdminConfig } from "@/lib/ai-learning/config";
import type { AILearningContext } from "@/lib/ai-learning/context";
import { generateAILearningResponse } from "@/lib/ai-learning/service";

type RequestPayload = {
  message?: string;
  context?: AILearningContext;
  config?: Partial<AILearningAdminConfig>;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestPayload;

  const message = payload.message?.trim();
  const context = payload.context;

  if (!message || !context) {
    return NextResponse.json(
      {
        enabled: false,
        message: "Missing message or AI learning context.",
        suggestions: [],
        disclaimers: [],
        milestone: null,
        contextSummary: "",
      },
      { status: 400 },
    );
  }

  const response = generateAILearningResponse({
    message,
    context,
    config: mergeAILearningConfig(payload.config),
  });

  return NextResponse.json(response);
}
