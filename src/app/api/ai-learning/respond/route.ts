import { NextResponse } from "next/server";

import type { AILearningContext, MembershipStatus } from "@/lib/ai-learning/context";
import { runAILearningPipeline } from "@/lib/ai-learning/pipeline";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";

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

  // Membership/entitlement is security-sensitive and must never be trusted from
  // browser context. Resolve the authenticated member on the server and overwrite
  // any client-supplied membership before the shared AI pipeline evaluates policy.
  const memberSession = await getAuthenticatedMemberSession();
  const membership = memberSession.authenticated && memberSession.user
    ? resolveServerMembership(memberSession.user.membershipTier)
    : "public";
  const context: AILearningContext = { ...clientContext, membership };

  // Availability and policy configuration is server-authoritative. The browser
  // supplies non-authoritative learning context only; localStorage/admin payloads
  // cannot enable, disable, or otherwise alter AI policy.
  const response = await runAILearningPipeline({
    message: payload.message ?? "",
    context,
  });

  return NextResponse.json(response);
}
