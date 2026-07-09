import { NextResponse } from "next/server";

import { getOperationsDashboardData } from "@/lib/operations";

export async function GET() {
  return NextResponse.json(getOperationsDashboardData());
}
