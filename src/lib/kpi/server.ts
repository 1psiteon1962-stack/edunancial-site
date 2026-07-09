import { NextResponse } from "next/server";

import {
  buildRateLimitKey,
  isRateLimited,
  readJsonBody,
  sanitizeMetadata,
  sanitizeText,
  withApiHeaders,
} from "@/lib/api/security";

type KPIRequestBody = {
  event?: string;
  event_name?: string;
  event_type?: string | null;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

async function writeKPIEvent(event: {
  eventName: string;
  eventType?: string;
  metadata?: Record<string, unknown>;
}) {
  console.info("KPI event received", {
    eventName: event.eventName,
    eventType: event.eventType ?? null,
    metadataKeys: Object.keys(event.metadata ?? {}),
    receivedAt: new Date().toISOString(),
  });
}

export async function handleKpiRequest(request: Request) {
  const key = buildRateLimitKey("kpi", request);

  if (isRateLimited(key, { limit: 60, windowMs: 60_000 })) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Too many KPI requests" },
        { status: 429 }
      )
    );
  }

  const body = await readJsonBody<KPIRequestBody>(request);

  if (!body) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      )
    );
  }

  const eventName = sanitizeText(body.event_name ?? body.event, 80);
  if (!eventName) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Missing event name" },
        { status: 400 }
      )
    );
  }

  const eventType = sanitizeText(body.event_type ?? body.label, 80) ?? undefined;
  const metadataValue = sanitizeMetadata({
    ...(body.metadata ?? {}),
    ...(typeof body.value === "number" ? { value: body.value } : {}),
  });

  const metadata =
    metadataValue && typeof metadataValue === "object" && !Array.isArray(metadataValue)
      ? (metadataValue as Record<string, unknown>)
      : undefined;

  try {
    await writeKPIEvent({
      eventName,
      eventType,
      metadata,
    });

    return withApiHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.warn("KPI tracking route failed:", error);

    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "KPI tracking failed" },
        { status: 500 }
      )
    );
  }
}
