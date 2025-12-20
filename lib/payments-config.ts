// lib/payments-config.ts
// Placeholder-only payment configuration
// NO live keys, NO real processing

export type PaymentProvider =
  | "stripe"
  | "square"
  | "crypto"
  | "disabled";

export type RegionPayments = {
  currency: string;
  providers: PaymentProvider[];
};

export const PAYMENT_CONFIG: Record<string, RegionPayments> = {
  us: {
    currency: "USD",
    providers: ["stripe", "square"]
  },

  africa: {
    currency: "USD",
    providers: ["stripe", "crypto"]
  },

  india: {
    currency: "INR",
    providers: ["stripe"]
  },

  global: {
    currency: "USD",
    providers: ["stripe", "crypto"]
  }
};
