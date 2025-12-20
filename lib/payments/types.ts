export type PaymentRegion = "us" | "africa" | "latam" | "asia";

export type PaymentProvider =
  | "stripe"
  | "square"
  | "crypto"
  | "disabled";

export interface PaymentRoute {
  provider: PaymentProvider;
  enabled: boolean;
  label: string;
}
