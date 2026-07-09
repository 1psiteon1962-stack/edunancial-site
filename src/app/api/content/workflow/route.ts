import { NextResponse } from "next/server";

import { getArticleBySlug } from "@/lib/content/repository";
import { evaluateWorkflowTransition } from "@/lib/content/workflow";
import type { ContentState, EditorialActorRole } from "@/lib/content/types";

type WorkflowRequestBody = {
  slug?: string;
  nextState?: ContentState;
  actorName?: string;
  actorRole?: EditorialActorRole;
  scheduledFor?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WorkflowRequestBody;

    if (!body.slug || !body.nextState || !body.actorName || !body.actorRole) {
      return NextResponse.json(
        { success: false, error: "slug, nextState, actorName, and actorRole are required." },
        { status: 400 }
      );
    }

    const article = getArticleBySlug(body.slug);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found." },
        { status: 404 }
      );
    }

    const result = evaluateWorkflowTransition({
      article,
      nextState: body.nextState,
      actorName: body.actorName,
      actorRole: body.actorRole,
      scheduledFor: body.scheduledFor,
    });

    return NextResponse.json({ success: result.allowed, ...result });
  } catch (error) {
    console.warn("Workflow validation failed:", error);

    return NextResponse.json(
      { success: false, error: "Workflow validation failed." },
      { status: 500 }
    );
  }
}
