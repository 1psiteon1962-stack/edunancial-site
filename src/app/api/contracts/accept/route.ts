import { NextResponse } from "next/server";

import { writeAuditLog, writeSecurityEvent } from "@/lib/security/audit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getSecuritySessionFromRequest } from "@/lib/security/session";
import { readJsonBody, validateString } from "@/lib/security/validation";

export async function POST(req: Request) {
  const csrf = validateCsrfRequest(req);

  if (!csrf.ok) {
    writeSecurityEvent({
      event: "csrf.contract_accept.blocked",
      severity: "warning",
      request: req,
      metadata: { reason: csrf.reason },
    });

    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const rateLimit = applyRateLimit({
    request: req,
    name: "contracts.accept",
    limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_CONTRACTS ?? 20),
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await readJsonBody(req);
  const contractId = validateString(body?.contractId, {
    field: "contractId",
    maxLength: 120,
    minLength: 2,
  });

  if (!body || !contractId) {
    return NextResponse.json({ error: "Invalid contract payload." }, { status: 400 });
  }

  const session = await getSecuritySessionFromRequest(req);

  writeAuditLog({
    action: "contracts.accepted",
    actorId: session.userId,
    actorRole: session.role,
    target: contractId,
    outcome: "success",
    request: req,
  });

  return NextResponse.json({
    status: "accepted",
    contractId
  });
}
