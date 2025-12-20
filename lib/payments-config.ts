// lib/payments-config.ts
// Payment architecture (NO live processing)

export type Region =
  | "US"
  | "AFRICA"
  | "LATAM"
  | "INDIA"
  | "SINGAPORE"
  | "AUSTRALIA"
  | "HONG_KONG"
  | "GLOBAL";

export type PaymentProvider =
  | "STRIPE"
  | "SQUARE"
  | "CRYPTO"
  | "OFFLINE";

export interface PaymentRoute {
  region: Region;
  providers: PaymentProvider[];
  currency: string;
  status: "PLACEHOLDER" | "LIVE";
}

export const PAYMENT_MATRIX: PaymentRoute[] = [
  {
    region: "US",
    providers: ["STRIPE", "SQUARE", "CRYPTO"],
    currency: "USD",
    status: "PLACEHOLDER",
  },
  {
    region: "AFRICA",
    providers: ["CRYPTO"],
    currency: "USD",
    status: "PLACEHOLDER",
  },
  {
    region: "LATAM",
    providers: ["CRYPTO"],
    currency: "USD",
    status: "PLACEHOLDER",
  },
  {
    region: "INDIA",
    providers: ["CRYPTO"],
    currency: "INR",
    status: "PLACEHOLDER",
  },
  {
    region: "GLOBAL",
    providers: ["CRYPTO"],
    currency: "USD",
    status: "PLACEHOLDER",
  },
];

export function getPaymentConfig(region: Region) {
  return (
    PAYMENT_MATRIX.find((r) => r.region === region) ||
    PAYMENT_MATRIX.find((r) => r.region === "GLOBAL")!
  );
}
