import { handleKpiRequest } from "@/lib/kpi/server";

export async function POST(request: Request) {
  return handleKpiRequest(request);
}
