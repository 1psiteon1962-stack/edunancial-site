import { NextRequest, NextResponse } from "next/server";
import { generateDemoLogs } from "@/lib/logging";
import { type LogFilter } from "@/lib/logging";

/**
 * GET /api/monitoring/logs
 *
 * Returns structured log entries with filtering support.
 * In production, replace generateDemoLogs() with a real transport query
 * by calling getLogger().query(filter).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const filter: LogFilter = {
      limit: Math.min(Number(searchParams.get("limit") ?? 50), 200),
      offset: Number(searchParams.get("offset") ?? 0),
      search: searchParams.get("search") ?? undefined,
      service: searchParams.get("service") ?? undefined,
      correlationId: searchParams.get("correlationId") ?? undefined,
    };

    const rawSeverity = searchParams.get("severity");
    if (rawSeverity) filter.severity = rawSeverity.split(",") as LogFilter["severity"];

    const rawCategory = searchParams.get("category");
    if (rawCategory) filter.category = rawCategory.split(",") as LogFilter["category"];

    const rawFrom = searchParams.get("from");
    if (rawFrom) filter.from = Number(rawFrom);

    const rawTo = searchParams.get("to");
    if (rawTo) filter.to = Number(rawTo);

    // Demo data — replace with getLogger().query(filter) when logger is wired
    const all = generateDemoLogs(200);
    let entries = all;

    if (filter.severity?.length) entries = entries.filter((e) => filter.severity!.includes(e.severity));
    if (filter.category?.length) entries = entries.filter((e) => filter.category!.includes(e.category));
    if (filter.service)          entries = entries.filter((e) => e.service.includes(filter.service!));
    if (filter.search)           entries = entries.filter((e) => e.message.toLowerCase().includes(filter.search!.toLowerCase()));
    if (filter.from)             entries = entries.filter((e) => e.timestampMs >= filter.from!);
    if (filter.to)               entries = entries.filter((e) => e.timestampMs <= filter.to!);

    const total = entries.length;
    const paginated = entries.slice(filter.offset, (filter.offset ?? 0) + (filter.limit ?? 50));

    return NextResponse.json({
      ok: true,
      data: { entries: paginated, total, hasMore: (filter.offset ?? 0) + paginated.length < total },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
