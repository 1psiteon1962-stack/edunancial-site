import { NextRequest, NextResponse } from "next/server";
import {
  triggerRegistry,
  TriggerEventPayload,
  WorkflowTriggerEvent,
} from "@/lib/workflow";

const VALID_EVENTS = new Set<WorkflowTriggerEvent>([
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
]);

// POST /api/workflows/dispatch — dispatch a trigger event to matching workflows
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      eventType?: string;
      actorId?: string;
      entityType?: string;
      entityId?: string;
      data?: Record<string, unknown>;
    };

    const { eventType, actorId, entityType, entityId, data = {} } = body;

    if (!eventType || !VALID_EVENTS.has(eventType as WorkflowTriggerEvent)) {
      return NextResponse.json(
        { error: `Invalid or missing eventType. Valid values: ${[...VALID_EVENTS].join(", ")}` },
        { status: 400 }
      );
    }

    const payload: TriggerEventPayload = {
      eventType: eventType as WorkflowTriggerEvent,
      occurredAt: new Date().toISOString(),
      actorId,
      entityType,
      entityId,
      data,
    };

    await triggerRegistry.dispatch(payload);

    return NextResponse.json({ dispatched: true, eventType, occurredAt: payload.occurredAt });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
