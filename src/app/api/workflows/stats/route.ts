import { NextRequest, NextResponse } from "next/server";
import { workflowStore } from "@/lib/workflow";

// GET /api/workflows/stats — execution statistics
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId") ?? undefined;

  const stats = workflowStore.getStats(workflowId);
  return NextResponse.json({ stats });
}
