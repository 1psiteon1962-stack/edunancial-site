import { NextResponse } from "next/server";

import { writeAuditLog, writeSecurityEvent } from "@/lib/security/audit";
import { validateCsrfRequest } from "@/lib/security/csrf";
import {
  CONSENT_COOKIE_NAME,
  serializeConsentPreferences,
} from "@/lib/security/privacy";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getSecuritySessionFromRequest } from "@/lib/security/session";
import { readJsonBody } from "@/lib/security/validation";

export async function POST(request: Request) {
  const csrf = validateCsrfRequest(request);

  if (!csrf.ok) {
    writeSecurityEvent({
      event: "csrf.privacy_consent.blocked",
      severity: "warning",
      request,
      metadata: { reason: csrf.reason },
    });

    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const rateLimit = applyRateLimit({
    request,
    name: "privacy.consent",
    limit: Number(process.env.EDUNANCIAL_RATE_LIMIT_CONSENT ?? 20),
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await readJsonBody(request);

  if (!body || typeof body.analytics !== "boolean" || typeof body.marketing !== "boolean") {
    return NextResponse.json({ error: "Invalid consent payload." }, { status: 400 });
  }

  const session = await getSecuritySessionFromRequest(request);
  const response = NextResponse.json(
    {
      success: true,
      preferences: {
        essential: true,
        analytics: body.analytics,
        marketing: body.marketing,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );

  response.cookies.set(CONSENT_COOKIE_NAME, serializeConsentPreferences(body), {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  writeAuditLog({
    action: "privacy.consent.updated",
    actorId: session.userId,
    actorRole: session.role,
    target: "cookie-consent",
    outcome: "success",
    request,
    metadata: {
      analytics: body.analytics,
      marketing: body.marketing,
    },
  });

  return response;
}
