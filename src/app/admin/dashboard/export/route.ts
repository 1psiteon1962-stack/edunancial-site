import { NextResponse } from "next/server";

import { buildExportFilename, buildExportPayload } from "@/lib/bi/reporting";
import type { ExportFormat } from "@/lib/bi/types";

export const runtime = "nodejs";

function normalizeFormat(value: string | null): ExportFormat {
  if (value === "csv" || value === "xlsx" || value === "pdf") {
    return value;
  }

  return "pdf";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = normalizeFormat(searchParams.get("format"));
  const period = searchParams.get("period") ?? undefined;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;
  const filename = buildExportFilename(format, period, startDate, endDate);
  const payload = buildExportPayload(format, period, startDate, endDate);

  return new NextResponse(payload.body, {
    headers: {
      "Content-Type": payload.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
