import { WorkflowDefinition } from "./workflowTypes";

// ─── Validation result ────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Workflow validator ───────────────────────────────────────────────────────

export function validateWorkflow(wf: WorkflowDefinition): ValidationResult {
  const errors: ValidationError[] = [];

  if (!wf.name?.trim()) {
    errors.push({ field: "name", message: "Workflow name is required" });
  }

  if (!wf.triggerEvent) {
    errors.push({ field: "triggerEvent", message: "A trigger event is required" });
  }

  if (!wf.nodes || wf.nodes.length === 0) {
    errors.push({ field: "nodes", message: "Workflow must have at least one node" });
  }

  // Must have exactly one trigger node
  const triggerNodes = wf.nodes?.filter((n) => n.type === "trigger") ?? [];
  if (triggerNodes.length === 0) {
    errors.push({ field: "nodes", message: "Workflow must have a trigger node" });
  } else if (triggerNodes.length > 1) {
    errors.push({ field: "nodes", message: "Workflow must have exactly one trigger node" });
  }

  // Validate edges reference valid node ids
  const nodeIds = new Set(wf.nodes?.map((n) => n.id) ?? []);
  for (const edge of wf.edges ?? []) {
    if (!nodeIds.has(edge.sourceNodeId)) {
      errors.push({
        field: `edge.${edge.id}`,
        message: `Edge source node ${edge.sourceNodeId} does not exist`,
      });
    }
    if (!nodeIds.has(edge.targetNodeId)) {
      errors.push({
        field: `edge.${edge.id}`,
        message: `Edge target node ${edge.targetNodeId} does not exist`,
      });
    }
  }

  // Validate action nodes have actionType
  for (const node of wf.nodes ?? []) {
    if (node.type === "action" && !node.actionType) {
      errors.push({
        field: `node.${node.id}`,
        message: `Action node ${node.label} must specify an actionType`,
      });
    }
    if (node.type === "trigger" && !node.triggerEvent) {
      errors.push({
        field: `node.${node.id}`,
        message: `Trigger node ${node.label} must specify a triggerEvent`,
      });
    }
    if (node.type === "approval" && !node.approverRole) {
      errors.push({
        field: `node.${node.id}`,
        message: `Approval node ${node.label} must specify an approverRole`,
      });
    }
    if (node.type === "delay" && (!node.delayMs || node.delayMs <= 0)) {
      errors.push({
        field: `node.${node.id}`,
        message: `Delay node ${node.label} must specify a positive delayMs`,
      });
    }
  }

  // Detect disconnected nodes (except the trigger node)
  const reachable = new Set<string>();
  const triggerNode = wf.nodes?.find((n) => n.type === "trigger");
  if (triggerNode) {
    const traverse = (nodeId: string) => {
      if (reachable.has(nodeId)) return;
      reachable.add(nodeId);
      const outgoing = (wf.edges ?? []).filter((e) => e.sourceNodeId === nodeId);
      for (const edge of outgoing) traverse(edge.targetNodeId);
    };
    traverse(triggerNode.id);

    for (const node of wf.nodes ?? []) {
      if (!reachable.has(node.id)) {
        errors.push({
          field: `node.${node.id}`,
          message: `Node ${node.label} is unreachable from the trigger`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
