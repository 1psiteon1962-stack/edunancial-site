import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowNode,
  NodeExecutionState,
  ExecutionStatus,
  ExecutionContext,
  TriggerEventPayload,
  ActionInput,
} from "./workflowTypes";
import { actionRegistry } from "./actionRegistry";
import { workflowStore } from "./workflowStore";
import { workflowQueue } from "./workflowQueue";

// ─── Execution Orchestrator / State Machine ───────────────────────────────────

export class WorkflowEngine {
  /**
   * Start a new workflow execution for the given trigger payload.
   * Idempotent: duplicate idempotency keys are rejected.
   */
  async startExecution(
    workflow: WorkflowDefinition,
    payload: TriggerEventPayload,
    idempotencyKey?: string
  ): Promise<WorkflowExecution> {
    const key =
      idempotencyKey ??
      `${workflow.idempotencyPrefix ?? workflow.id}:${payload.occurredAt}:${
        payload.actorId ?? "system"
      }`;

    const existing = workflowStore.findExecutionByIdempotencyKey(key);
    if (existing) {
      return existing;
    }

    const triggerNode = workflow.nodes.find((n) => n.type === "trigger");
    if (!triggerNode) {
      throw new Error(`Workflow ${workflow.id} has no trigger node`);
    }

    const execution: WorkflowExecution = {
      id: generateId(),
      workflowId: workflow.id,
      workflowVersion: workflow.version,
      workflowName: workflow.name,
      triggerEvent: payload.eventType,
      triggerPayload: payload.data,
      status: "pending",
      currentNodeId: triggerNode.id,
      nodeStates: {},
      idempotencyKey: key,
      startedAt: new Date().toISOString(),
      metadata: {},
    };

    workflowStore.saveExecution(execution);

    // Queue the first step
    workflowQueue.enqueue({
      executionId: execution.id,
      workflowId: workflow.id,
      nodeId: triggerNode.id,
      priority: 1,
      scheduledAt: new Date().toISOString(),
      maxAttempts: 3,
    });

    return execution;
  }

  /**
   * Process a single node in an execution.
   */
  async processNode(
    execution: WorkflowExecution,
    nodeId: string
  ): Promise<void> {
    const workflow = workflowStore.getWorkflow(execution.workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${execution.workflowId} not found`);
    }

    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found in workflow ${workflow.id}`);
    }

    // Update execution state
    execution.status = "running";
    execution.currentNodeId = nodeId;
    const nodeState: NodeExecutionState = {
      nodeId,
      status: "running",
      startedAt: new Date().toISOString(),
      retryCount: execution.nodeStates[nodeId]?.retryCount ?? 0,
    };
    execution.nodeStates[nodeId] = nodeState;
    workflowStore.saveExecution(execution);

    try {
      const ctx: ExecutionContext = {
        executionId: execution.id,
        workflowId: execution.workflowId,
        workflowName: execution.workflowName,
        nodeId,
        triggerEvent: execution.triggerEvent,
        triggerPayload: execution.triggerPayload,
        variables: execution.metadata,
      };

      await this.executeNode(node, ctx, execution);

      nodeState.status = "completed";
      nodeState.completedAt = new Date().toISOString();
      execution.nodeStates[nodeId] = nodeState;

      // Advance to next nodes
      const nextNodeIds = this.resolveNextNodes(workflow, node, execution);

      if (nextNodeIds.length === 0) {
        // End of workflow
        execution.status = "completed";
        execution.completedAt = new Date().toISOString();
        workflowStore.saveExecution(execution);
        return;
      }

      // Handle parallel vs sequential
      if (node.type === "parallel") {
        for (const nextId of nextNodeIds) {
          workflowQueue.enqueue({
            executionId: execution.id,
            workflowId: workflow.id,
            nodeId: nextId,
            priority: 1,
            scheduledAt: new Date().toISOString(),
            maxAttempts: node.maxRetries ?? 3,
          });
        }
      } else {
        const [nextId] = nextNodeIds;
        workflowQueue.enqueue({
          executionId: execution.id,
          workflowId: workflow.id,
          nodeId: nextId,
          priority: 1,
          scheduledAt: resolveDelayedSchedule(node),
          maxAttempts: node.maxRetries ?? 3,
        });
      }

      workflowStore.saveExecution(execution);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      nodeState.status = "failed";
      nodeState.error = errorMsg;
      nodeState.completedAt = new Date().toISOString();
      execution.nodeStates[nodeId] = nodeState;

      const maxRetries = node.maxRetries ?? 2;
      if (nodeState.retryCount < maxRetries) {
        nodeState.retryCount += 1;
        nodeState.status = "retrying";
        execution.status = "retrying";
        workflowStore.saveExecution(execution);
        const delayMs = (node.retryDelayMs ?? 5000) * nodeState.retryCount;
        workflowQueue.enqueue({
          executionId: execution.id,
          workflowId: workflow.id,
          nodeId,
          priority: 2,
          scheduledAt: new Date(Date.now() + delayMs).toISOString(),
          maxAttempts: maxRetries,
        });
      } else {
        execution.status = "failed";
        execution.error = errorMsg;
        execution.completedAt = new Date().toISOString();
        workflowStore.saveExecution(execution);
      }
    }
  }

  private async executeNode(
    node: WorkflowNode,
    ctx: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    switch (node.type) {
      case "trigger":
        // Trigger nodes are pass-through – execution was already initiated
        return;

      case "end":
        return;

      case "delay":
        // Delay is handled via queue scheduling; nothing to execute at runtime
        return;

      case "approval":
        // Mark execution as waiting for approval
        execution.status = "waiting_approval";
        workflowStore.saveExecution(execution);
        // In a real system, send approval request here
        return;

      case "condition":
        // Condition evaluation happens in resolveNextNodes
        return;

      case "parallel":
        // Branching happens in the parent processNode call
        return;

      case "action": {
        if (!node.actionType) {
          throw new Error(`Action node ${node.id} has no actionType`);
        }
        const executor = actionRegistry.getExecutor(node.actionType);
        if (!executor) {
          throw new Error(`No executor registered for action: ${node.actionType}`);
        }
        const input: ActionInput = {
          actionType: node.actionType,
          config: node.config,
          triggerPayload: execution.triggerPayload,
          executionContext: ctx,
        };
        const output = await executor.execute(input);
        if (!output.success) {
          throw new Error(output.error ?? "Action execution failed");
        }
        execution.nodeStates[node.id].output = output.result ?? {};
        return;
      }

      default:
        return;
    }
  }

  /**
   * Determine which node(s) come after the current node.
   */
  private resolveNextNodes(
    workflow: WorkflowDefinition,
    currentNode: WorkflowNode,
    execution: WorkflowExecution
  ): string[] {
    const outgoingEdges = workflow.edges.filter(
      (e) => e.sourceNodeId === currentNode.id
    );

    if (outgoingEdges.length === 0) return [];

    if (currentNode.type === "condition") {
      // Evaluate condition
      const conditionResult = evaluateCondition(
        currentNode.conditionExpression ?? "true",
        execution
      );
      const branch = conditionResult ? "true" : "false";
      const matchingEdge = outgoingEdges.find(
        (e) => e.condition === branch || e.condition === undefined
      );
      return matchingEdge ? [matchingEdge.targetNodeId] : [];
    }

    if (currentNode.type === "parallel") {
      return outgoingEdges.map((e) => e.targetNodeId);
    }

    return [outgoingEdges[0].targetNodeId];
  }

  /**
   * Resume a waiting-for-approval execution.
   */
  async resolveApproval(
    executionId: string,
    nodeId: string,
    decision: "approved" | "rejected"
  ): Promise<void> {
    const execution = workflowStore.getExecution(executionId);
    if (!execution) throw new Error(`Execution ${executionId} not found`);

    const nodeState = execution.nodeStates[nodeId];
    if (!nodeState) throw new Error(`Node state for ${nodeId} not found`);

    nodeState.approvalResponse = decision;
    nodeState.status = decision === "approved" ? "completed" : "failed";
    nodeState.completedAt = new Date().toISOString();

    if (decision === "approved") {
      execution.status = "running";
      const workflow = workflowStore.getWorkflow(execution.workflowId);
      if (workflow) {
        const node = workflow.nodes.find((n) => n.id === nodeId);
        if (node) {
          const nextNodeIds = this.resolveNextNodes(workflow, node, execution);
          for (const nextId of nextNodeIds) {
            workflowQueue.enqueue({
              executionId,
              workflowId: workflow.id,
              nodeId: nextId,
              priority: 1,
              scheduledAt: new Date().toISOString(),
              maxAttempts: 3,
            });
          }
        }
      }
    } else {
      execution.status = "cancelled";
      execution.completedAt = new Date().toISOString();
    }

    workflowStore.saveExecution(execution);
  }

  /**
   * Retry a failed execution from the point of failure.
   */
  async retryExecution(executionId: string): Promise<void> {
    const execution = workflowStore.getExecution(executionId);
    if (!execution) throw new Error(`Execution ${executionId} not found`);
    if (execution.status !== "failed") {
      throw new Error(`Execution ${executionId} is not in failed state`);
    }

    // Reset failed nodes
    for (const nodeId of Object.keys(execution.nodeStates)) {
      const ns = execution.nodeStates[nodeId];
      if (ns.status === "failed") {
        ns.status = "pending";
        ns.error = undefined;
        ns.retryCount = 0;
        execution.nodeStates[nodeId] = ns;
      }
    }

    execution.status = "pending";
    execution.error = undefined;
    execution.completedAt = undefined;

    const failedNodeId = Object.values(execution.nodeStates).find(
      (ns) => ns.status === "pending"
    )?.nodeId ?? execution.currentNodeId;

    if (failedNodeId) {
      workflowQueue.enqueue({
        executionId,
        workflowId: execution.workflowId,
        nodeId: failedNodeId,
        priority: 1,
        scheduledAt: new Date().toISOString(),
        maxAttempts: 3,
      });
    }

    workflowStore.saveExecution(execution);
  }

  /**
   * Cancel a running execution.
   */
  async cancelExecution(executionId: string): Promise<void> {
    const execution = workflowStore.getExecution(executionId);
    if (!execution) throw new Error(`Execution ${executionId} not found`);
    execution.status = "cancelled";
    execution.completedAt = new Date().toISOString();
    workflowStore.saveExecution(execution);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function resolveDelayedSchedule(node: WorkflowNode): string {
  if (node.type === "delay" && node.delayMs) {
    return new Date(Date.now() + node.delayMs).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Evaluates a condition expression without using dynamic code evaluation.
 *
 * Supports:
 *   {{path}} <op> <literal>
 *   <literal> <op> {{path}}
 *   {{path}} (truthy check)
 *
 * Operators: ===, !==, ==, !=, >=, <=, >, <
 * Literals: number, "string", 'string', true, false, null
 */
function evaluateCondition(
  expression: string,
  execution: WorkflowExecution
): boolean {
  if (!expression || expression.trim() === "true") return true;
  if (expression.trim() === "false") return false;

  const ctx: Record<string, unknown> = {
    triggerPayload: execution.triggerPayload,
    metadata: execution.metadata,
  };

  function resolvePath(path: string): unknown {
    const keys = path.split(".");
    let val: unknown = ctx;
    for (const key of keys) {
      if (val && typeof val === "object" && key in (val as object)) {
        val = (val as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return val;
  }

  function parseLiteral(token: string): unknown {
    const t = token.trim();
    if (t === "true") return true;
    if (t === "false") return false;
    if (t === "null" || t === "undefined") return null;
    if ((t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1);
    }
    const n = Number(t);
    if (!isNaN(n) && t !== "") return n;
    return t;
  }

  function resolveToken(token: string): unknown {
    const t = token.trim();
    const varMatch = t.match(/^\{\{(\w+(?:\.\w+)*)\}\}$/);
    if (varMatch) return resolvePath(varMatch[1]);
    return parseLiteral(t);
  }

  // Match: <token> <op> <token>
  const opPattern = /^(.+?)\s*(===|!==|==|!=|>=|<=|>|<)\s*(.+)$/;
  const match = expression.trim().match(opPattern);

  if (match) {
    const [, leftRaw, op, rightRaw] = match;
    const left = resolveToken(leftRaw);
    const right = resolveToken(rightRaw);

    switch (op) {
      case "===": return left === right;
      case "!==": return left !== right;
      case "==":  return left == right;  // eslint-disable-line eqeqeq
      case "!=":  return left != right;  // eslint-disable-line eqeqeq
      case ">=":  return Number(left) >= Number(right);
      case "<=":  return Number(left) <= Number(right);
      case ">":   return Number(left) > Number(right);
      case "<":   return Number(left) < Number(right);
      default: return false;
    }
  }

  // Single token — truthy check
  const singleVal = resolveToken(expression.trim());
  return Boolean(singleVal);
}

export const workflowEngine = new WorkflowEngine();
