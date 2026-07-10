import { NextRequest, NextResponse } from "next/server";
import { workflowStore } from "@/lib/workflow";

// GET /api/workflows/executions — list all executions
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  let executions = workflowStore.listExecutions(workflowId);

  if (status) {
    executions = executions.filter((e) => e.status === status);
  }

  // Sort by most recent first
  executions = executions.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return NextResponse.json({ executions, total: executions.length });
}
