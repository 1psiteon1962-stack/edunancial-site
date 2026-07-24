import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { listProvisionedMembers } from "@/lib/payments/membershipLifecycle";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const members = listProvisionedMembers();

  return NextResponse.json({
    members,
    total: members.length,
  });
}
