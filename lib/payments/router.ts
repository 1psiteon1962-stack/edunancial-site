import { PAYMENT_CONFIG } from "./config";
import { PaymentRegion, PaymentRoute } from "./types";

export function getPaymentOptions(region: PaymentRegion): PaymentRoute[] {
  return PAYMENT_CONFIG[region] || [];
}
