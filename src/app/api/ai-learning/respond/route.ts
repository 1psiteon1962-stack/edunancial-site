import { NextResponse } from "next/server";

import type { AILearningContext } from "@/lib/ai-learning/context";
import { runAILearningPipeline } from "@/lib/ai-learning/pipeline";

type RequestPayload = {
  message?: string;
  context?: AILearningContext;
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

  // Availability and policy configuration is server-authoritative. The browser
  // supplies learner context only; localStorage/admin payloads cannot enable,
  // disable, or otherwise alter the AI policy applied to a request.
  const response = await runAILearningPipeline({
    message: payload.message ?? "",
    context,
  });

  return NextResponse.json(response);
}
