import {
  DEFAULT_REGION_ID,
  getRegionalConfiguration,
  GlobalRegionId,
  RegionalPaymentProviderId,
} from "../international/regions";

export interface CheckoutSessionInput {
  amount: number;
  currency: string;
  customerId?: string;
}

export interface CheckoutSessionResult {
  status: "ready" | "placeholder";
  providerId: RegionalPaymentProviderId;
  checkoutUrl?: string;
  message?: string;
}

export interface PaymentProviderAdapter {
  id: RegionalPaymentProviderId;
  displayName: string;
  supportsRegions: GlobalRegionId[];
  createCheckoutSession: (
    input: CheckoutSessionInput
  ) => Promise<CheckoutSessionResult>;
}

function buildPlaceholderAdapter(
  id: RegionalPaymentProviderId,
  displayName: string,
  supportsRegions: GlobalRegionId[]
): PaymentProviderAdapter {
  return {
    id,
    displayName,
    supportsRegions,
    async createCheckoutSession() {
      return {
        status: "placeholder",
        providerId: id,
        message:
          "Placeholder provider adapter. Backend credentials/integration still required.",
      };
    },
  };
}

const PROVIDER_REGISTRY: Record<RegionalPaymentProviderId, PaymentProviderAdapter> = {
  square: {
    id: "square",
    displayName: "Square",
    supportsRegions: [DEFAULT_REGION_ID],
    async createCheckoutSession() {
      return {
        status: "ready",
        providerId: "square",
      };
    },
  },
  stripe: buildPlaceholderAdapter("stripe", "Stripe", [
    "latin-america",
    "caribbean",
    "europe",
    "middle-east",
    "asia-pacific",
  ]),
  flutterwave: buildPlaceholderAdapter("flutterwave", "Flutterwave", ["africa"]),
  paystack: buildPlaceholderAdapter("paystack", "Paystack", ["africa"]),
  "mobile-money": buildPlaceholderAdapter("mobile-money", "Mobile Money", [
    "africa",
  ]),
  "local-eu-methods": buildPlaceholderAdapter(
    "local-eu-methods",
    "EU Local Methods",
    ["europe"]
  ),
  "local-latam-gateway": buildPlaceholderAdapter(
    "local-latam-gateway",
    "LATAM Local Gateway",
    ["latin-america", "caribbean"]
  ),
  "local-apac-methods": buildPlaceholderAdapter(
    "local-apac-methods",
    "APAC Local Methods (Alipay, WeChat Pay, PayPay, Paytm, GrabPay, GCash, PayNow, KakaoPay, LINE Pay)",
    ["middle-east", "asia-pacific"]
  ),
};

export interface RegionalPaymentPlan {
  regionId: GlobalRegionId;
  defaultCurrency: string;
  primaryProvider: PaymentProviderAdapter;
  providers: PaymentProviderAdapter[];
}

export function getPaymentProviderAdapter(providerId: RegionalPaymentProviderId) {
  return PROVIDER_REGISTRY[providerId];
}

export function resolveRegionalPaymentPlan(regionId?: string): RegionalPaymentPlan {
  const regionConfig = getRegionalConfiguration(regionId);
  const providerAdapters = regionConfig.paymentProviders
    .map((providerId) => PROVIDER_REGISTRY[providerId])
    .filter(Boolean);

  const primaryProvider =
    providerAdapters[0] ?? PROVIDER_REGISTRY[getRegionalConfiguration().paymentProviders[0]];

  return {
    regionId: regionConfig.id,
    defaultCurrency: regionConfig.defaultPricing.currency,
    primaryProvider,
    providers: providerAdapters,
  };
}
