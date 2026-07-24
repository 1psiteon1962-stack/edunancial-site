import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { squareConfig, validateSquareConfig } from "@/lib/square";
import { logStructuredError } from "@/lib/observability/errors";
import { getRequestId, attachRequestHeaders } from "@/lib/observability/tracing";

interface RefundRequestBody {
  paymentId?: string;
  amount?: number;
  currency?: string;
  reason?: string;
}

interface SquareRefundResponse {
  refund?: {
    id: string;
    status: string;
    amount_money?: { amount: number; currency: string };
  };
  errors?: { category: string; code: string; detail?: string }[];
}

export async function POST(request: Request) {
  const requestId = getRequestId(request.headers);

  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as RefundRequestBody;
    const { paymentId, amount, currency = "USD", reason } = body;

    if (!paymentId) {
      return attachRequestHeaders(
        NextResponse.json(
          { success: false, error: "paymentId is required.", requestId },
          { status: 400 }
        ),
        requestId
      );
    }

    if (!amount || amount <= 0) {
      return attachRequestHeaders(
        NextResponse.json(
          { success: false, error: "A positive refund amount is required.", requestId },
          { status: 400 }
        ),
        requestId
      );
    }

    if (!validateSquareConfig()) {
      return attachRequestHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Square is not configured. Refund cannot be processed.",
            requestId,
          },
          { status: 503 }
        ),
        requestId
      );
    }

    const squareApiBase =
      squareConfig.environment === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    const squareResponse = await fetch(`${squareApiBase}/v2/refunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + squareConfig.accessToken,
        "Square-Version": "2024-06-04",
      },
      body: JSON.stringify({
        idempotency_key: `${requestId}-refund-${paymentId}`,
        payment_id: paymentId,
        amount_money: {
          amount: Math.round(amount * 100),
          currency: currency.toUpperCase(),
        },
        reason: reason ?? "Admin-initiated refund",
      }),
    });

    const squareData = (await squareResponse.json()) as SquareRefundResponse;

    if (!squareResponse.ok) {
      const detail = squareData.errors?.[0]?.detail ?? squareResponse.statusText;
      return attachRequestHeaders(
        NextResponse.json(
          {
            success: false,
            error: `Square refund error: ${detail}`,
            requestId,
          },
          { status: squareResponse.status >= 400 && squareResponse.status < 500 ? 400 : 502 }
        ),
        requestId
      );
    }

    return attachRequestHeaders(
      NextResponse.json({
        success: true,
        refundId: squareData.refund?.id,
        status: squareData.refund?.status,
        requestId,
      }),
      requestId
    );
  } catch (error) {
    logStructuredError(error, { route: "/api/admin/payments/refund", requestId });
    return attachRequestHeaders(
      NextResponse.json(
        { success: false, error: "Refund processing failed", requestId },
        { status: 500 }
      ),
      requestId
    );
  }
}
