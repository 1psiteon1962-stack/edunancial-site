import { NextRequest, NextResponse } from "next/server";
import { workflowStore, validateWorkflow, WorkflowDefinition } from "@/lib/workflow";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/workflows/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }
  return NextResponse.json({ workflow });
}

// PATCH /api/workflows/[id] — update workflow (only drafts)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  try {
    const body = await req.json() as Partial<WorkflowDefinition>;
    const updated: WorkflowDefinition = {
      ...workflow,
      ...body,
      id: workflow.id,
      version: workflow.version,
      status: workflow.status,
      createdAt: workflow.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const validation = validateWorkflow(updated);
    workflowStore.saveWorkflow(updated);

    return NextResponse.json({ workflow: updated, validation });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE /api/workflows/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }
  if (workflow.status === "published") {
    return NextResponse.json(
      { error: "Cannot delete a published workflow; archive it first" },
      { status: 409 }
    );
  }
  workflowStore.deleteWorkflow(id);
  return NextResponse.json({ success: true });
}
