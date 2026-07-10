// ─── Workflow Definition Schema ──────────────────────────────────────────────

export type WorkflowStatus = "draft" | "published" | "archived" | "paused";

export type WorkflowNodeType =
  | "trigger"
  | "action"
  | "condition"
  | "delay"
  | "parallel"
  | "approval"
  | "loop"
  | "end";

export type WorkflowTriggerEvent =
  | "member.registered"
  | "member.login"
  | "membership.upgraded"
  | "membership.cancelled"
  | "payment.received"
  | "payment.failed"
  | "course.enrolled"
  | "course.completed"
  | "certificate.earned"
  | "support.ticket_created"
  | "blog.published"
  | "admin.action"
  | "schedule.cron"
  | "manual";

export type WorkflowActionType =
  | "send_email"
  | "send_notification"
  | "update_member"
  | "award_achievement"
  | "generate_certificate"
  | "schedule_reminder"
  | "call_api"
  | "trigger_webhook"
  | "write_audit_log"
  | "create_admin_task";

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "waiting_approval"
  | "retrying";

// ─── Node definitions ─────────────────────────────────────────────────────────

export interface WorkflowPosition {
  x: number;
  y: number;
}

export interface WorkflowNodeConfig {
  [key: string]: unknown;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: WorkflowPosition;
  config: WorkflowNodeConfig;
  // For trigger nodes
  triggerEvent?: WorkflowTriggerEvent;
  // For action nodes
  actionType?: WorkflowActionType;
  // For condition nodes
  conditionExpression?: string;
  // Retry config
  maxRetries?: number;
  retryDelayMs?: number;
  // Delay config (ms)
  delayMs?: number;
  // Approval config
  approverRole?: string;
  approvalTimeoutMs?: number;
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  // For condition edges: "true" | "false" | custom string
  condition?: string;
}

// ─── Workflow definition ──────────────────────────────────────────────────────

export interface WorkflowDefinition {
  id: string;
  version: number;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerEvent: WorkflowTriggerEvent;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  // Idempotency key prefix for executions
  idempotencyPrefix?: string;
}

// ─── Execution state ──────────────────────────────────────────────────────────

export interface NodeExecutionState {
  nodeId: string;
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string;
  output?: Record<string, unknown>;
  error?: string;
  retryCount: number;
  approvalResponse?: "approved" | "rejected";
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowVersion: number;
  workflowName: string;
  triggerEvent: WorkflowTriggerEvent;
  triggerPayload: Record<string, unknown>;
  status: ExecutionStatus;
  currentNodeId: string | null;
  nodeStates: Record<string, NodeExecutionState>;
  idempotencyKey: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  executedBy?: string;
  metadata: Record<string, unknown>;
}

// ─── Queue items ──────────────────────────────────────────────────────────────

export interface WorkflowQueueItem {
  id: string;
  executionId: string;
  workflowId: string;
  nodeId: string;
  priority: number;
  scheduledAt: string;
  attempts: number;
  maxAttempts: number;
  status: "queued" | "processing" | "done" | "dead_letter";
  lastError?: string;
}

// ─── Trigger event payload contracts ─────────────────────────────────────────

export interface TriggerEventPayload {
  eventType: WorkflowTriggerEvent;
  occurredAt: string;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  data: Record<string, unknown>;
}

// ─── Action I/O contracts ─────────────────────────────────────────────────────

export interface ActionInput {
  actionType: WorkflowActionType;
  config: WorkflowNodeConfig;
  triggerPayload: Record<string, unknown>;
  executionContext: ExecutionContext;
}

export interface ActionOutput {
  success: boolean;
  result?: Record<string, unknown>;
  error?: string;
}

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  workflowName: string;
  nodeId: string;
  triggerEvent: WorkflowTriggerEvent;
  triggerPayload: Record<string, unknown>;
  variables: Record<string, unknown>;
}

// ─── AI integration interfaces ────────────────────────────────────────────────

export interface AIWorkflowRecommendation {
  id: string;
  title: string;
  description: string;
  suggestedWorkflow: Partial<WorkflowDefinition>;
  confidence: number;
  reasoning: string;
}

export interface AIOptimizationSuggestion {
  executionId: string;
  suggestion: string;
  estimatedImpact: "low" | "medium" | "high";
}

export interface AINaturalLanguageRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AINaturalLanguageResponse {
  workflow: Partial<WorkflowDefinition>;
  clarifications?: string[];
}

// ─── Workflow stats ───────────────────────────────────────────────────────────

export interface WorkflowStats {
  workflowId: string;
  workflowName: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgDurationMs: number;
  lastExecutedAt?: string;
  successRate: number;
}

// ─── Admin task ───────────────────────────────────────────────────────────────

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  assignedRole: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  dueAt?: string;
  workflowExecutionId?: string;
}
