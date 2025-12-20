import { PaymentRegion, PaymentRoute } from "./types";

/**
 * PAYMENT ROUTING BY REGION
 * No live keys here. UI + routing only.
 */
export const PAYMENT_CONFIG: Record<PaymentRegion, PaymentRoute[]> = {
  us: [
    { provider: "stripe", enabled: true, label: "Pay with Card (Stripe)" },
    { provider: "square", enabled: true, label: "Pay with Square" },
    { provider: "crypto", enabled: false, label: "Crypto (Coming Soon)" },
  ],

  africa: [
    { provider: "stripe", enabled: true, label: "International Card" },
    { provider: "crypto", enabled: false, label: "Crypto (Coming Soon)" },
  ],

  latam: [
    { provider: "stripe", enabled: true, label: "International Card" },
    { provider: "crypto", enabled: false, label: "Crypto (Coming Soon)" },
  ],

  asia: [
    { provider: "stripe", enabled: true, label: "International Card" },
    { provider: "crypto", enabled: false, label: "Crypto (Coming Soon)" },
  ],
};
