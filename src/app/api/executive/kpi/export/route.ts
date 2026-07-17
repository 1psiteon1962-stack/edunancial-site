import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getExecutiveSnapshot } from "@/lib/executive/adapters";
import { buildExecutiveKPICsv } from "@/lib/executive/export";

export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;

  const snapshot = await getExecutiveSnapshot();
  const csv = buildExecutiveKPICsv(snapshot);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="edunancial-executive-kpi-${date}.csv"`,
    },
  });
}
