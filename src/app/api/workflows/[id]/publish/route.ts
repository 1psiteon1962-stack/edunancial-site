import { NextRequest, NextResponse } from "next/server";
import { workflowStore, validateWorkflow } from "@/lib/workflow";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/workflows/[id]/publish — validate and publish a workflow
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const validation = validateWorkflow(workflow);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Workflow validation failed", errors: validation.errors },
      { status: 422 }
    );
  }

  const now = new Date().toISOString();
  const published = {
    ...workflow,
    status: "published" as const,
    version: workflow.version + 1,
    publishedAt: now,
    updatedAt: now,
  };

  workflowStore.saveWorkflow(published);

  return NextResponse.json({ workflow: published });
}

// DELETE /api/workflows/[id]/publish — unpublish (set back to draft)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const workflow = workflowStore.getWorkflow(id);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const updated = {
    ...workflow,
    status: "draft" as const,
    publishedAt: undefined,
    updatedAt: new Date().toISOString(),
  };

  workflowStore.saveWorkflow(updated);

  return NextResponse.json({ workflow: updated });
}
