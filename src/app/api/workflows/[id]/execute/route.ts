import { NextRequest, NextResponse } from "next/server";
import {
  workflowStore,
  workflowEngine,
  triggerRegistry,
  TriggerEventPayload,
} from "@/lib/workflow";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/workflows/[id]/execute — manually trigger execution
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  if (workflow.status !== "published") {
    return NextResponse.json(
      { error: "Only published workflows can be executed" },
      { status: 409 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    // Empty body is fine for manual triggers
  }

  const payload: TriggerEventPayload = {
    eventType: "manual",
    occurredAt: new Date().toISOString(),
    actorId: String(body.triggeredBy ?? "admin"),
    data: body.data as Record<string, unknown> ?? {},
  };

  try {
    const execution = await workflowEngine.startExecution(workflow, payload);
    // Notify trigger registry (for handler side effects)
    await triggerRegistry.dispatch(payload).catch(() => {});
    return NextResponse.json({ execution }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
