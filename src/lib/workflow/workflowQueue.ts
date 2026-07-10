import { WorkflowQueueItem } from "./workflowTypes";

// ─── Queue-backed processing store ───────────────────────────────────────────
// In production this would be backed by Redis, SQS, or similar

let idCounter = 0;

class WorkflowQueue {
  private items: Map<string, WorkflowQueueItem> = new Map();

  enqueue(params: {
    executionId: string;
    workflowId: string;
    nodeId: string;
    priority: number;
    scheduledAt: string;
    maxAttempts: number;
  }): WorkflowQueueItem {
    const id = `q_${Date.now()}_${++idCounter}`;
    const item: WorkflowQueueItem = {
      id,
      executionId: params.executionId,
      workflowId: params.workflowId,
      nodeId: params.nodeId,
      priority: params.priority,
      scheduledAt: params.scheduledAt,
      attempts: 0,
      maxAttempts: params.maxAttempts,
      status: "queued",
    };
    this.items.set(id, item);
    return item;
  }

  /**
   * Dequeue the next ready item (scheduled time has passed, not yet processing).
   */
  dequeue(): WorkflowQueueItem | undefined {
    const now = new Date().toISOString();
    const ready = Array.from(this.items.values())
      .filter((i) => i.status === "queued" && i.scheduledAt <= now)
      .sort((a, b) => a.priority - b.priority || a.scheduledAt.localeCompare(b.scheduledAt));

    if (ready.length === 0) return undefined;

    const item = ready[0];
    item.status = "processing";
    item.attempts += 1;
    this.items.set(item.id, item);
    return item;
  }

  complete(itemId: string): void {
    const item = this.items.get(itemId);
    if (item) {
      item.status = "done";
      this.items.set(itemId, item);
    }
  }

  fail(itemId: string, error: string): void {
    const item = this.items.get(itemId);
    if (!item) return;
    item.lastError = error;
    if (item.attempts >= item.maxAttempts) {
      item.status = "dead_letter";
    } else {
      item.status = "queued";
      // Exponential backoff
      const backoffMs = Math.pow(2, item.attempts) * 1000;
      item.scheduledAt = new Date(Date.now() + backoffMs).toISOString();
    }
    this.items.set(itemId, item);
  }

  listQueued(): WorkflowQueueItem[] {
    return Array.from(this.items.values()).filter((i) => i.status === "queued");
  }

  listProcessing(): WorkflowQueueItem[] {
    return Array.from(this.items.values()).filter(
      (i) => i.status === "processing"
    );
  }

  listDeadLetter(): WorkflowQueueItem[] {
    return Array.from(this.items.values()).filter(
      (i) => i.status === "dead_letter"
    );
  }

  listAll(): WorkflowQueueItem[] {
    return Array.from(this.items.values());
  }

  size(): number {
    return Array.from(this.items.values()).filter(
      (i) => i.status === "queued" || i.status === "processing"
    ).length;
  }
}

export const workflowQueue = new WorkflowQueue();
