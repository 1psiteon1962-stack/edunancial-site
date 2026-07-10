import { WorkflowTriggerEvent, TriggerEventPayload, WorkflowDefinition } from "./workflowTypes";
import { workflowStore } from "./workflowStore";
import { workflowEngine } from "./workflowEngine";

// ─── Trigger handler interface ────────────────────────────────────────────────

export interface TriggerHandler {
  eventType: WorkflowTriggerEvent;
  name: string;
  description: string;
  payloadSchema: Record<string, string>;
  handle(payload: TriggerEventPayload): Promise<void>;
}

// ─── Trigger registry ─────────────────────────────────────────────────────────

class TriggerRegistry {
  private handlers: Map<WorkflowTriggerEvent, TriggerHandler> = new Map();

  register(handler: TriggerHandler): void {
    this.handlers.set(handler.eventType, handler);
  }

  getHandler(eventType: WorkflowTriggerEvent): TriggerHandler | undefined {
    return this.handlers.get(eventType);
  }

  listHandlers(): TriggerHandler[] {
    return Array.from(this.handlers.values());
  }

  /**
   * Dispatch an event to all matching published workflows.
   * Idempotent: same payload will not start duplicate executions.
   */
  async dispatch(payload: TriggerEventPayload): Promise<void> {
    const matchingWorkflows = this.findMatchingWorkflows(payload.eventType);

    await Promise.allSettled(
      matchingWorkflows.map((wf) =>
        workflowEngine.startExecution(wf, payload).catch((err) => {
          console.error(
            `[TriggerRegistry] Failed to start execution for workflow ${wf.id}:`,
            err
          );
        })
      )
    );
  }

  private findMatchingWorkflows(
    eventType: WorkflowTriggerEvent
  ): WorkflowDefinition[] {
    return workflowStore
      .listWorkflows()
      .filter(
        (wf) =>
          wf.status === "published" && wf.triggerEvent === eventType
      );
  }
}

export const triggerRegistry = new TriggerRegistry();

// ─── Register all built-in trigger handlers ───────────────────────────────────

import { memberTriggers } from "./triggers/memberTriggers";
import { paymentTriggers } from "./triggers/paymentTriggers";
import { courseTriggers } from "./triggers/courseTriggers";
import { adminTriggers } from "./triggers/adminTriggers";

for (const handler of [
  ...memberTriggers,
  ...paymentTriggers,
  ...courseTriggers,
  ...adminTriggers,
]) {
  triggerRegistry.register(handler);
}
