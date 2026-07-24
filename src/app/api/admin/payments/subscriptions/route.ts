import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listMembershipSubscriptions } from "@/lib/payments/membershipLifecycle";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const subscriptions = listMembershipSubscriptions();

  return NextResponse.json({
    subscriptions,
    total: subscriptions.length,
  });
}
