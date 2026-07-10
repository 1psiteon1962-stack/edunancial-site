import { NextRequest, NextResponse } from "next/server";
import { workflowStore, workflowEngine } from "@/lib/workflow";

interface Params {
  params: Promise<{ executionId: string }>;
}

// GET /api/workflows/executions/[executionId]
export async function GET(_req: NextRequest, { params }: Params) {
  const { executionId } = await params;
  const execution = workflowStore.getExecution(executionId);
  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }
  return NextResponse.json({ execution });
}

// POST /api/workflows/executions/[executionId] — operational control
export async function POST(req: NextRequest, { params }: Params) {
  const { executionId } = await params;
  const execution = workflowStore.getExecution(executionId);
  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }

  let body: { action?: string; nodeId?: string; decision?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { action, nodeId, decision } = body;

  try {
    switch (action) {
      case "retry":
        await workflowEngine.retryExecution(executionId);
        break;
      case "cancel":
        await workflowEngine.cancelExecution(executionId);
        break;
      case "approve":
      case "reject":
        if (!nodeId) {
          return NextResponse.json(
            { error: "nodeId is required for approval actions" },
            { status: 400 }
          );
        }
        await workflowEngine.resolveApproval(
          executionId,
          nodeId,
          (decision ?? action) as "approved" | "rejected"
        );
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const updated = workflowStore.getExecution(executionId);
    return NextResponse.json({ execution: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
