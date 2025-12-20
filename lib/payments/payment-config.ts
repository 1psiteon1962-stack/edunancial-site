export type Region =
  | "US"
  | "AFRICA"
  | "INDIA"
  | "LATAM"
  | "GLOBAL";

export type PaymentProvider =
  | "stripe"
  | "square"
  | "paystack"
  | "flutterwave"
  | "razorpay"
  | "crypto";

export interface PaymentConfig {
  region: Region;
  providers: PaymentProvider[];
  currency: string;
}

export const PAYMENT_CONFIG: Record<Region, PaymentConfig> = {
  US: {
    region: "US",
    providers: ["stripe", "square"],
    currency: "USD",
  },
  AFRICA: {
    region: "AFRICA",
    providers: ["paystack", "flutterwave"],
    currency: "USD",
  },
  INDIA: {
    region: "INDIA",
    providers: ["razorpay"],
    currency: "INR",
  },
  LATAM: {
    region: "LATAM",
    providers: ["stripe"],
    currency: "USD",
  },
  GLOBAL: {
    region: "GLOBAL",
    providers: ["stripe", "crypto"],
    currency: "USD",
  },
};
