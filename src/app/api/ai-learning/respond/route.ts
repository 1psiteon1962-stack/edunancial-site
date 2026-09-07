import { NextResponse } from "next/server";

import type { AILearningContext, MembershipStatus } from "@/lib/ai-learning/context";
import { runAILearningPipeline } from "@/lib/ai-learning/pipeline";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";
import { getCourseProgressRows } from "@/lib/member/progress";

type RequestPayload = {
  message?: string;
  context?: AILearningContext;
};

function resolveServerMembership(value: string | null | undefined): MembershipStatus {
  if (value === "free" || value === "basic" || value === "premium" || value === "enterprise" || value === "beta") {
    return value;
  }
  return "public";
}

async function resolveServerProgress(userId: string | null): Promise<Pick<AILearningContext, "progressPercent" | "completedLessons">> {
  if (!userId) return { progressPercent: 0, completedLessons: [] };

  try {
    const rows = await getCourseProgressRows(userId);
    const completedLessons = Array.from(new Set(rows.flatMap((row) => row.completed_lesson_ids ?? [])));
    const totalWeight = rows.length;
    const progressPercent = totalWeight > 0
      ? Math.round(rows.reduce((sum, row) => sum + Math.max(0, Math.min(100, row.progress_percent ?? 0)), 0) / totalWeight)
      : 0;
    return { progressPercent, completedLessons };
  } catch {
    // Progress enrichment must fail closed rather than trusting browser claims or
    // taking the universal AI Coach offline because the progress store is degraded.
    return { progressPercent: 0, completedLessons: [] };
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestPayload;
  const clientContext = payload.context;

  if (!clientContext) {
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

  const memberSession = await getAuthenticatedMemberSession();
  const authenticatedUser = memberSession.authenticated ? memberSession.user : null;
  const membership = authenticatedUser
    ? resolveServerMembership(authenticatedUser.membershipTier)
    : "public";
  const progress = await resolveServerProgress(authenticatedUser?.id ?? null);

  // Security- and achievement-sensitive context is server-authoritative. Browser
  // membership, progress percentage and completed-lesson claims are overwritten
  // before the shared AI pipeline evaluates policy, coaching depth or milestones.
  const context: AILearningContext = {
    ...clientContext,
    membership,
    progressPercent: progress.progressPercent,
    completedLessons: progress.completedLessons,
  };

  // Availability and policy configuration is server-authoritative. The browser
  // supplies non-authoritative navigation/locale context only; localStorage/admin
  // payloads cannot enable, disable, or otherwise alter AI policy.
  const response = await runAILearningPipeline({
    message: payload.message ?? "",
    context,
  });

  return NextResponse.json(response);
}
