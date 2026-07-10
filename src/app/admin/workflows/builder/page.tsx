"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeType,
  WorkflowActionType,
  WorkflowTriggerEvent,
  WorkflowDefinition,
} from "@/lib/workflow/workflowTypes";

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_TYPES: { type: WorkflowNodeType; label: string; color: string }[] = [
  { type: "trigger", label: "Trigger", color: "bg-purple-700 border-purple-500" },
  { type: "action", label: "Action", color: "bg-blue-700 border-blue-500" },
  { type: "condition", label: "Condition", color: "bg-amber-700 border-amber-500" },
  { type: "delay", label: "Delay", color: "bg-teal-700 border-teal-500" },
  { type: "approval", label: "Approval", color: "bg-orange-700 border-orange-500" },
  { type: "parallel", label: "Parallel", color: "bg-indigo-700 border-indigo-500" },
  { type: "end", label: "End", color: "bg-slate-600 border-slate-400" },
];

const NODE_COLOR: Record<WorkflowNodeType, string> = Object.fromEntries(
  NODE_TYPES.map((n) => [n.type, n.color])
) as Record<WorkflowNodeType, string>;

const TRIGGER_EVENTS: WorkflowTriggerEvent[] = [
  "member.registered",
  "member.login",
  "membership.upgraded",
  "membership.cancelled",
  "payment.received",
  "payment.failed",
  "course.enrolled",
  "course.completed",
  "certificate.earned",
  "support.ticket_created",
  "blog.published",
  "admin.action",
  "schedule.cron",
  "manual",
];

const ACTION_TYPES: WorkflowActionType[] = [
  "send_email",
  "send_notification",
  "update_member",
  "award_achievement",
  "generate_certificate",
  "schedule_reminder",
  "call_api",
  "trigger_webhook",
  "write_audit_log",
  "create_admin_task",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface DragState {
  nodeId: string;
  startX: number;
  startY: number;
  nodeStartX: number;
  nodeStartY: number;
}

interface ConnectionState {
  sourceNodeId: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Main builder component ───────────────────────────────────────────────────

export default function WorkflowBuilderPage() {
  const [workflowId] = useState<string>(generateId("wf"));
  const [name, setName] = useState("New Workflow");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] =
    useState<WorkflowTriggerEvent>("member.registered");
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "node_trigger",
      type: "trigger",
      label: "Trigger",
      position: { x: 200, y: 60 },
      config: {},
      triggerEvent: "member.registered",
    },
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [connecting, setConnecting] = useState<ConnectionState | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "published" | "error"
  >("idle");
  const [importError, setImportError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  // ── Node palette drop ──────────────────────────────────────────────────────

  const addNode = useCallback(
    (type: WorkflowNodeType) => {
      const newNode: WorkflowNode = {
        id: generateId("node"),
        type,
        label:
          NODE_TYPES.find((n) => n.type === type)?.label ?? type,
        position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
        config: {},
        maxRetries: 3,
        retryDelayMs: 5000,
        ...(type === "trigger" ? { triggerEvent } : {}),
        ...(type === "delay" ? { delayMs: 86400000 } : {}),
        ...(type === "approval" ? { approverRole: "admin" } : {}),
      };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
    },
    [triggerEvent]
  );

  // ── Node drag ──────────────────────────────────────────────────────────────

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connecting) {
      // Finish connection
      if (connecting.sourceNodeId !== nodeId) {
        const newEdge: WorkflowEdge = {
          id: generateId("e"),
          sourceNodeId: connecting.sourceNodeId,
          targetNodeId: nodeId,
        };
        setEdges((prev) => [...prev, newEdge]);
      }
      setConnecting(null);
      return;
    }
    setSelectedNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setDragState({
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: node.position.x,
      nodeStartY: node.position.y,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragState.nodeId
          ? {
              ...n,
              position: {
                x: Math.max(0, dragState.nodeStartX + dx),
                y: Math.max(0, dragState.nodeStartY + dy),
              },
            }
          : n
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDragState(null);
  };

  const handleCanvasClick = () => {
    if (connecting) {
      setConnecting(null);
    }
    setSelectedNodeId(null);
  };

  // ── Node update ────────────────────────────────────────────────────────────

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
      );
    },
    []
  );

  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) =>
      prev.filter(
        (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId
      )
    );
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const deleteEdge = (edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const errors: ValidationError[] = [];
    if (!name.trim())
      errors.push({ field: "name", message: "Workflow name is required" });
    const triggerNodes = nodes.filter((n) => n.type === "trigger");
    if (triggerNodes.length === 0)
      errors.push({ field: "nodes", message: "At least one trigger node is required" });
    if (triggerNodes.length > 1)
      errors.push({ field: "nodes", message: "Only one trigger node is allowed" });
    const actionNodes = nodes.filter((n) => n.type === "action");
    for (const n of actionNodes) {
      if (!n.actionType)
        errors.push({
          field: `node.${n.id}`,
          message: `Action node "${n.label}" must have an action type`,
        });
    }
    setValidationErrors(errors);
    return errors.length === 0;
  }, [name, nodes]);

  // ── Save (draft) ───────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaveStatus("saving");
    const body: Partial<WorkflowDefinition> = {
      id: workflowId,
      name,
      description,
      triggerEvent,
      nodes,
      edges,
      status: "draft",
    };
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  // ── Publish ────────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!validate()) return;
    // Save first, then publish
    await handleSave();
    setPublishStatus("publishing");
    try {
      const res = await fetch(`/api/workflows/${workflowId}/publish`, {
        method: "POST",
      });
      if (res.ok) {
        setPublishStatus("published");
        setTimeout(() => setPublishStatus("idle"), 3000);
      } else {
        const data = await res.json() as { errors?: ValidationError[] };
        if (data.errors) setValidationErrors(data.errors);
        setPublishStatus("error");
      }
    } catch {
      setPublishStatus("error");
    }
  };

  // ── Export ─────────────────────────────────────────────────────────────────

  const handleExport = () => {
    const def: Partial<WorkflowDefinition> = {
      name,
      description,
      triggerEvent,
      nodes,
      edges,
      version: 1,
    };
    const blob = new Blob([JSON.stringify(def, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import ─────────────────────────────────────────────────────────────────

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const def = JSON.parse(ev.target?.result as string) as Partial<WorkflowDefinition>;
        if (def.name) setName(def.name);
        if (def.description) setDescription(def.description);
        if (def.triggerEvent) setTriggerEvent(def.triggerEvent);
        if (def.nodes) setNodes(def.nodes);
        if (def.edges) setEdges(def.edges);
        setImportError(null);
      } catch {
        setImportError("Failed to parse workflow file. Ensure it is valid JSON.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#08101f] text-white flex flex-col">
      {/* ── Toolbar ── */}
      <header className="flex items-center justify-between gap-4 px-8 py-4 bg-[#0d1627] border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/workflows"
            className="text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            ← Workflows
          </Link>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Workflow name"
            className="rounded-lg bg-[#08101f] border border-white/20 px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
            placeholder="Workflow name"
          />
        </div>

        <div className="flex items-center gap-3">
          {validationErrors.length > 0 && (
            <span className="text-red-400 text-xs">
              {validationErrors.length} validation error
              {validationErrors.length > 1 ? "s" : ""}
            </span>
          )}

          <label className="cursor-pointer rounded-xl border border-white/20 bg-[#101a2f] px-4 py-2 text-sm hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400">
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="sr-only"
              aria-label="Import workflow JSON"
            />
          </label>

          <button
            onClick={handleExport}
            className="rounded-xl border border-white/20 bg-[#101a2f] px-4 py-2 text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Export
          </button>

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="rounded-xl border border-white/20 bg-[#101a2f] px-4 py-2 text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            aria-label="Save as draft"
          >
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
              ? "✓ Saved"
              : saveStatus === "error"
              ? "⚠ Error"
              : "Save Draft"}
          </button>

          <button
            onClick={handlePublish}
            disabled={publishStatus === "publishing"}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            aria-label="Validate and publish workflow"
          >
            {publishStatus === "publishing"
              ? "Publishing…"
              : publishStatus === "published"
              ? "✓ Published"
              : publishStatus === "error"
              ? "⚠ Failed"
              : "Publish"}
          </button>
        </div>
      </header>

      {/* ── Import error ── */}
      {importError && (
        <div
          role="alert"
          className="bg-red-900 text-red-300 px-8 py-3 text-sm border-b border-red-700"
        >
          {importError}
          <button
            onClick={() => setImportError(null)}
            className="ml-4 text-red-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Validation errors ── */}
      {validationErrors.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red-950 border-b border-red-800 px-8 py-3"
        >
          <ul className="list-disc list-inside text-sm text-red-300">
            {validationErrors.map((err) => (
              <li key={err.field}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Node palette ── */}
        <aside
          aria-label="Node palette"
          className="w-52 border-r border-white/10 bg-[#0d1627] p-4 flex flex-col gap-2 overflow-y-auto"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Nodes
          </p>
          {NODE_TYPES.map((nt) => (
            <button
              key={nt.type}
              onClick={() => addNode(nt.type)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold text-left hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 ${nt.color}`}
              aria-label={`Add ${nt.label} node`}
            >
              {nt.label}
            </button>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Trigger Event
            </p>
            <select
              value={triggerEvent}
              onChange={(e) =>
                setTriggerEvent(e.target.value as WorkflowTriggerEvent)
              }
              className="w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Workflow trigger event"
            >
              {TRIGGER_EVENTS.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Description
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe this workflow…"
              aria-label="Workflow description"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
            <p className="font-semibold mb-1">Keyboard shortcuts</p>
            <p>Click canvas to deselect</p>
            <p>Click node to select</p>
            <p>Drag node to reposition</p>
            <p>Use &quot;Connect&quot; to link nodes</p>
            <p>Del button removes selected</p>
          </div>
        </aside>

        {/* ── Canvas ── */}
        <div
          ref={canvasRef}
          className="relative flex-1 overflow-auto bg-[#08101f] cursor-default"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          role="application"
          aria-label="Workflow canvas"
          tabIndex={0}
          onKeyDown={(e) => {
            if (
              (e.key === "Delete" || e.key === "Backspace") &&
              selectedNodeId
            ) {
              e.preventDefault();
              deleteNode(selectedNodeId);
            }
          }}
          style={{ minWidth: 900, minHeight: 700 }}
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.sourceNodeId);
              const tgt = nodes.find((n) => n.id === edge.targetNodeId);
              if (!src || !tgt) return null;
              const x1 = src.position.x + 80;
              const y1 = src.position.y + 30;
              const x2 = tgt.position.x + 80;
              const y2 = tgt.position.y;
              const cx = (x1 + x2) / 2;
              return (
                <g key={edge.id}>
                  <path
                    d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <polygon
                    points={`${x2},${y2} ${x2 - 6},${y2 - 10} ${x2 + 6},${y2 - 10}`}
                    fill="#3b82f6"
                  />
                  {edge.label && (
                    <text
                      x={cx}
                      y={(y1 + y2) / 2 - 6}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                  {/* Click target to delete edge */}
                  <path
                    d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="12"
                    className="cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEdge(edge.id);
                    }}
                    role="button"
                    aria-label={`Delete connection from ${edge.sourceNodeId} to ${edge.targetNodeId}`}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <WorkflowNodeCard
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              connecting={!!connecting}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onDelete={() => deleteNode(node.id)}
              onConnect={() => setConnecting({ sourceNodeId: node.id })}
            />
          ))}

          {/* Connecting hint */}
          {connecting && (
            <div
              aria-live="polite"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-blue-900 border border-blue-600 px-6 py-3 text-sm text-blue-200"
            >
              Click a target node to connect, or click canvas to cancel.
            </div>
          )}
        </div>

        {/* ── Inspector panel ── */}
        <aside
          aria-label="Node inspector"
          className="w-72 border-l border-white/10 bg-[#0d1627] p-6 overflow-y-auto"
        >
          {selectedNode ? (
            <NodeInspector
              node={selectedNode}
              onChange={(updates) => updateNode(selectedNode.id, updates)}
            />
          ) : (
            <div className="text-gray-500 text-sm mt-8 text-center">
              <p>Select a node to inspect and configure it.</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

// ─── Node card ────────────────────────────────────────────────────────────────

function WorkflowNodeCard({
  node,
  selected,
  connecting,
  onMouseDown,
  onDelete,
  onConnect,
}: {
  node: WorkflowNode;
  selected: boolean;
  connecting: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onConnect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${node.label} node`}
      aria-pressed={selected}
      style={{ left: node.position.x, top: node.position.y }}
      className={`absolute w-40 rounded-xl border-2 p-3 cursor-grab active:cursor-grabbing select-none ${
        NODE_COLOR[node.type] ?? "bg-gray-700 border-gray-500"
      } ${selected ? "ring-2 ring-white" : ""} ${
        connecting ? "cursor-crosshair" : ""
      }`}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onMouseDown(e as unknown as React.MouseEvent);
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1">
        {node.type}
      </p>
      <p className="text-sm font-semibold text-white truncate">{node.label}</p>
      {node.actionType && (
        <p className="text-xs text-white/50 truncate">{node.actionType}</p>
      )}
      {node.triggerEvent && node.type === "trigger" && (
        <p className="text-xs text-white/50 truncate">{node.triggerEvent}</p>
      )}

      {selected && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect();
            }}
            className="flex-1 rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Start connection from this node"
          >
            Connect
          </button>
          {node.type !== "trigger" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded bg-red-800/60 px-2 py-1 text-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`Delete node ${node.label}`}
            >
              Del
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Node inspector ────────────────────────────────────────────────────────────

function NodeInspector({
  node,
  onChange,
}: {
  node: WorkflowNode;
  onChange: (updates: Partial<WorkflowNode>) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        {node.label}{" "}
        <span className="text-xs text-gray-400 font-normal capitalize">
          ({node.type})
        </span>
      </h2>

      {/* Label */}
      <label className="block mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Label</span>
        <input
          type="text"
          value={node.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      {/* Trigger node config */}
      {node.type === "trigger" && (
        <label className="block mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Trigger Event
          </span>
          <select
            value={node.triggerEvent ?? "manual"}
            onChange={(e) =>
              onChange({ triggerEvent: e.target.value as WorkflowTriggerEvent })
            }
            className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {TRIGGER_EVENTS.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Action node config */}
      {node.type === "action" && (
        <label className="block mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Action Type
          </span>
          <select
            value={node.actionType ?? ""}
            onChange={(e) =>
              onChange({ actionType: e.target.value as WorkflowActionType })
            }
            className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select action…</option>
            {ACTION_TYPES.map((at) => (
              <option key={at} value={at}>
                {at}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Condition node config */}
      {node.type === "condition" && (
        <label className="block mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Condition Expression
          </span>
          <input
            type="text"
            value={node.conditionExpression ?? ""}
            onChange={(e) => onChange({ conditionExpression: e.target.value })}
            className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
            placeholder="e.g. {{triggerPayload.amount}} > 100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {"{{triggerPayload.field}}"} syntax
          </p>
        </label>
      )}

      {/* Delay node config */}
      {node.type === "delay" && (
        <label className="block mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Delay (hours)
          </span>
          <input
            type="number"
            min={0}
            value={Math.round((node.delayMs ?? 3600000) / 3600000)}
            onChange={(e) =>
              onChange({ delayMs: Number(e.target.value) * 3600000 })
            }
            className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
      )}

      {/* Approval node config */}
      {node.type === "approval" && (
        <>
          <label className="block mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Approver Role
            </span>
            <input
              type="text"
              value={node.approverRole ?? "admin"}
              onChange={(e) => onChange({ approverRole: e.target.value })}
              className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="block mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Timeout (hours)
            </span>
            <input
              type="number"
              min={0}
              value={Math.round(
                (node.approvalTimeoutMs ?? 86400000) / 3600000
              )}
              onChange={(e) =>
                onChange({
                  approvalTimeoutMs: Number(e.target.value) * 3600000,
                })
              }
              className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </>
      )}

      {/* Retry config (for action nodes) */}
      {(node.type === "action" || node.type === "condition") && (
        <>
          <label className="block mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Max Retries
            </span>
            <input
              type="number"
              min={0}
              max={10}
              value={node.maxRetries ?? 3}
              onChange={(e) => onChange({ maxRetries: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="block mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Retry Delay (seconds)
            </span>
            <input
              type="number"
              min={1}
              value={Math.round((node.retryDelayMs ?? 5000) / 1000)}
              onChange={(e) =>
                onChange({ retryDelayMs: Number(e.target.value) * 1000 })
              }
              className="mt-1 w-full rounded-lg bg-[#08101f] border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </>
      )}

      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
        <p className="font-mono">ID: {node.id}</p>
        <p className="font-mono">
          Pos: {Math.round(node.position.x)}, {Math.round(node.position.y)}
        </p>
      </div>
    </div>
  );
}
