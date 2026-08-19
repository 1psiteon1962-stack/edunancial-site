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
        pipeline: { version: "1.0", stages: ["ingress"] },
      },
      { status: 400 },
    );
  }

  const response = await runAILearningPipeline({
    message,
    context,
    config: payload.config,
  });

  return NextResponse.json(response);
}
