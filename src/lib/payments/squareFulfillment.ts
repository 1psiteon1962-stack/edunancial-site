import { applyAuthoritativeMembershipEntitlement } from "@/lib/member/entitlements";
import { squareConfig } from "@/lib/square";

export interface SquareCompletedPayment {
  status?: string;
  order_id?: string;
  buyer_email_address?: string;
}

interface SquareOrderResponse {
  order?: { metadata?: Record<string, string> };
}

export async function fulfillSquareMembershipPayment(payment: SquareCompletedPayment): Promise<boolean> {
  if (payment.status?.toUpperCase() !== "COMPLETED") return false;
  if (!payment.order_id || !payment.buyer_email_address) return false;

  const squareApiBase = squareConfig.environment === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";

  const response = await fetch(`${squareApiBase}/v2/orders/${encodeURIComponent(payment.order_id)}`, {
    headers: {
      Authorization: `Bearer ${squareConfig.accessToken}`,
      "Square-Version": "2026-07-15",
    },
  });
  if (!response.ok) throw new Error(`Unable to retrieve Square order ${payment.order_id}.`);

  const payload = (await response.json()) as SquareOrderResponse;
  const planId = payload.order?.metadata?.membership_plan_id?.trim();
  if (!planId) return false;

  await applyAuthoritativeMembershipEntitlement({
    email: payment.buyer_email_address.trim(),
    planId,
  });
  return true;
}
