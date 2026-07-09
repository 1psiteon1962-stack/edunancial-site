import { NextResponse } from "next/server"
import { fetchEventsCSV } from "@/lib/kpi/adminQueries"
import { GlobalPermission } from "@/lib/globalPermissions"
import { writeAuditLog } from "@/lib/security/audit"
import { applyRateLimit } from "@/lib/security/rate-limit"
import { getSecuritySessionFromRequest, hasSessionPermission } from "@/lib/security/session"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const session = await getSecuritySessionFromRequest(request)

    if (!hasSessionPermission(session, GlobalPermission.MANAGE_KPIS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const rateLimit = applyRateLimit({
      request,
      name: "admin.kpi.export",
      limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_EXPORTS ?? 10),
      windowMs: 10 * 60 * 1000,
      sessionKey: session.userId,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many export requests" }, { status: 429 })
    }

    const csv = await fetchEventsCSV()

    writeAuditLog({
      action: "admin.kpi.exported",
      actorId: session.userId,
      actorRole: session.role,
      target: "kpi-events.csv",
      outcome: "success",
      request,
    })

    return new NextResponse(csv, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=kpi-events.csv"
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export KPI data" },
      { status: 500 }
    )
  }
}
