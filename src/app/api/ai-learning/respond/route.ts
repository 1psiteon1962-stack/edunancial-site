import { NextResponse } from "next/server";

import type { AILearningAdminConfig } from "@/lib/ai-learning/config";
import type { AILearningContext } from "@/lib/ai-learning/context";
import { runAILearningPipeline } from "@/lib/ai-learning/pipeline";

type RequestPayload = {
  message?: string;
  context?: AILearningContext;
  config?: Partial<AILearningAdminConfig>;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestPayload;
  const context = payload.context;

  if (!context) {
    return NextResponse.json(
      {
        enabled: false,
        message: "Missing AI learning context.",
        suggestions: [],
        disclaimers: [],
        milestone: null,
        contextSummary: "",
      },
      { status: 400 },
    );
  }

  const response = await runAILearningPipeline({
    message: payload.message ?? "",
    context,
    config: payload.config,
  });

  return NextResponse.json(response);
}
