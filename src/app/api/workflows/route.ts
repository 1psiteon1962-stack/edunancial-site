import { NextRequest, NextResponse } from "next/server";
import { workflowStore, validateWorkflow, WorkflowDefinition } from "@/lib/workflow";

// GET /api/workflows — list all workflows
export async function GET() {
  const workflows = workflowStore.listWorkflows();
  return NextResponse.json({ workflows, total: workflows.length });
}

// POST /api/workflows — create a new workflow (draft)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<WorkflowDefinition>;

    const now = new Date().toISOString();
    const workflow: WorkflowDefinition = {
      id: `wf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      version: 1,
      name: body.name ?? "Untitled Workflow",
      description: body.description ?? "",
      status: "draft",
      triggerEvent: body.triggerEvent ?? "manual",
      nodes: body.nodes ?? [],
      edges: body.edges ?? [],
      tags: body.tags ?? [],
      createdBy: body.createdBy ?? "admin",
      createdAt: now,
      updatedAt: now,
    };

    const validation = validateWorkflow(workflow);
    // Allow saving drafts with validation warnings, but return them
    workflowStore.saveWorkflow(workflow);

    return NextResponse.json(
      { workflow, validation },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
