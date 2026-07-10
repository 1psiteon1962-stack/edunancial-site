import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStats,
  AdminTask,
} from "./workflowTypes";

// ─── In-memory workflow store ─────────────────────────────────────────────────
// In production this would be backed by a database (Supabase, PostgreSQL, etc.)

class WorkflowStore {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private adminTasks: Map<string, AdminTask> = new Map();

  // ── Workflow CRUD ─────────────────────────────────────────────────────────

  saveWorkflow(workflow: WorkflowDefinition): WorkflowDefinition {
    this.workflows.set(workflow.id, { ...workflow });
    return workflow;
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }

  // ── Execution CRUD ────────────────────────────────────────────────────────

  saveExecution(execution: WorkflowExecution): WorkflowExecution {
    this.executions.set(execution.id, { ...execution });
    return execution;
  }

  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  listExecutions(workflowId?: string): WorkflowExecution[] {
    const all = Array.from(this.executions.values());
    return workflowId ? all.filter((e) => e.workflowId === workflowId) : all;
  }

  findExecutionByIdempotencyKey(key: string): WorkflowExecution | undefined {
    for (const exec of this.executions.values()) {
      if (exec.idempotencyKey === key) return exec;
    }
    return undefined;
  }

  // ── Admin Tasks ───────────────────────────────────────────────────────────

  saveAdminTask(task: AdminTask): AdminTask {
    this.adminTasks.set(task.id, { ...task });
    return task;
  }

  listAdminTasks(): AdminTask[] {
    return Array.from(this.adminTasks.values());
  }

  // ── Statistics ────────────────────────────────────────────────────────────

  getStats(workflowId?: string): WorkflowStats[] {
    const workflows = workflowId
      ? [this.workflows.get(workflowId)].filter(Boolean) as WorkflowDefinition[]
      : Array.from(this.workflows.values());

    return workflows.map((wf) => {
      const execs = this.listExecutions(wf.id);
      const successful = execs.filter((e) => e.status === "completed");
      const failed = execs.filter((e) => e.status === "failed");
      const durations = successful
        .filter((e) => e.completedAt)
        .map(
          (e) =>
            new Date(e.completedAt!).getTime() -
            new Date(e.startedAt).getTime()
        );
      const avgDuration =
        durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;
      const lastExec = execs.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )[0];

      return {
        workflowId: wf.id,
        workflowName: wf.name,
        totalExecutions: execs.length,
        successfulExecutions: successful.length,
        failedExecutions: failed.length,
        avgDurationMs: Math.round(avgDuration),
        lastExecutedAt: lastExec?.startedAt,
        successRate:
          execs.length > 0
            ? Math.round((successful.length / execs.length) * 100)
            : 0,
      };
    });
  }
}

export const workflowStore = new WorkflowStore();

// ─── Seed with sample workflows for demo ──────────────────────────────────────

import { WorkflowTriggerEvent } from "./workflowTypes";

function seedSampleWorkflows() {
  const now = new Date().toISOString();

  const sampleTriggers: WorkflowTriggerEvent[] = [
    "member.registered",
    "payment.received",
    "course.completed",
    "membership.upgraded",
  ];

  const names = [
    "Welcome New Member",
    "Payment Confirmation Flow",
    "Course Completion Rewards",
    "Membership Upgrade Campaign",
  ];

  sampleTriggers.forEach((trigger, i) => {
    const wf: WorkflowDefinition = {
      id: `wf_sample_${i + 1}`,
      version: 1,
      name: names[i],
      description: `Automated workflow for ${trigger}`,
      status: i < 3 ? "published" : "draft",
      triggerEvent: trigger,
      nodes: [
        {
          id: "node_trigger",
          type: "trigger",
          label: "Trigger",
          position: { x: 100, y: 100 },
          config: {},
          triggerEvent: trigger,
        },
        {
          id: "node_action_1",
          type: "action",
          label: "Send Email",
          position: { x: 100, y: 250 },
          config: {
            subject: `Action for ${names[i]}`,
            templateId: "default",
          },
          actionType: "send_email",
          maxRetries: 3,
          retryDelayMs: 5000,
        },
        {
          id: "node_end",
          type: "end",
          label: "End",
          position: { x: 100, y: 400 },
          config: {},
        },
      ],
      edges: [
        { id: "e1", sourceNodeId: "node_trigger", targetNodeId: "node_action_1" },
        { id: "e2", sourceNodeId: "node_action_1", targetNodeId: "node_end" },
      ],
      tags: ["automation"],
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
      publishedAt: i < 3 ? now : undefined,
    };
    workflowStore.saveWorkflow(wf);

    // Seed some executions
    for (let j = 0; j < 3; j++) {
      const exec: WorkflowExecution = {
        id: `exec_sample_${i}_${j}`,
        workflowId: wf.id,
        workflowVersion: 1,
        workflowName: wf.name,
        triggerEvent: trigger,
        triggerPayload: { userId: `user_${j}`, email: `user${j}@example.com` },
        status: j === 2 && i === 3 ? "failed" : "completed",
        currentNodeId: j === 2 && i === 3 ? "node_action_1" : "node_end",
        nodeStates: {},
        idempotencyKey: `${wf.id}:seed:${j}`,
        startedAt: new Date(Date.now() - (j + 1) * 3600000).toISOString(),
        completedAt:
          j === 2 && i === 3
            ? undefined
            : new Date(Date.now() - j * 3600000 + 1200).toISOString(),
        error: j === 2 && i === 3 ? "Email service timeout" : undefined,
        metadata: {},
      };
      workflowStore.saveExecution(exec);
    }
  });
}

seedSampleWorkflows();
