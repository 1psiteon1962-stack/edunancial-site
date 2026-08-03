import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_AI_LEARNING_CONFIG, mergeAILearningConfig, type AILearningAdminConfig } from "@/lib/ai-learning/config";

let inMemoryConfig: AILearningAdminConfig = DEFAULT_AI_LEARNING_CONFIG;

export async function GET(request: Request) {
  const session = await requireAdminApiSession(request);
  if (!session.ok) {
    return session.response;
  }

  return NextResponse.json(inMemoryConfig);
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession(request, true);
  if (!session.ok) {
    return session.response;
  }

  const payload = (await request.json()) as Partial<AILearningAdminConfig>;
  inMemoryConfig = mergeAILearningConfig(payload);

  return NextResponse.json({ ok: true, config: inMemoryConfig });
}
