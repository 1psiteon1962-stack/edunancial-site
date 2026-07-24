import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { paymentTransactions } from "@/lib/payments/transactions";

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const status = searchParams.get("status");

  let filtered = [...paymentTransactions];

  if (provider) {
    filtered = filtered.filter((t) => t.provider === provider);
  }

  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }

  const sorted = filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    transactions: sorted,
    total: sorted.length,
  });
}
