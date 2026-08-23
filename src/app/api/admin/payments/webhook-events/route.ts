import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listProcessedWebhookEvents } from "@/lib/payments/webhookIdempotency";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const events = await listProcessedWebhookEvents();

  return NextResponse.json({
    events,
    total: events.length,
  });
}
