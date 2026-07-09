import { NextResponse } from "next/server";

import { writeAuditLog, writeSecurityEvent } from "@/lib/security/audit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { encryptSensitiveValue } from "@/lib/security/encryption";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getSecuritySessionFromRequest } from "@/lib/security/session";
import { readJsonBody, validateNumber, validateString } from "@/lib/security/validation";

export async function POST(request: Request) {
  const csrf = validateCsrfRequest(request);

  if (!csrf.ok) {
    writeSecurityEvent({
     event: "csrf.checkout.blocked",
     severity: "warning",
     request,
     metadata: { reason: csrf.reason },
    });

    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const session = await getSecuritySessionFromRequest(request);
  const rateLimit = applyRateLimit({
    request,
    name: "square.checkout",
    limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_CHECKOUT ?? 10),
    windowMs: 10 * 60 * 1000,
    sessionKey: session.userId,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many checkout attempts." }, { status: 429 });
  }

  const body = await readJsonBody(request);
  const id = validateString(body?.id, {
    field: "id",
    maxLength: 120,
    minLength: 1,
  });
  const name = validateString(body?.name, {
    field: "name",
    maxLength: 120,
    minLength: 1,
  });
  const price = validateNumber(body?.price, {
    max: 100000,
    min: 0,
  });

  if (!body || !id || !name || price === null) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const actorReference = session.userId
    ? await encryptSensitiveValue(session.userId)
    : null;

  writeAuditLog({
    action: "payments.checkout.started",
    actorId: session.userId,
    actorRole: session.role,
    target: id,
    outcome: "success",
    request,
    metadata: {
     actorReference,
     price,
     productName: name,
    },
  });

  return NextResponse.json({
    success: true,

    checkoutUrl:
     "/checkout?product=" + encodeURIComponent(id),
  });

}
