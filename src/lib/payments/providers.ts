export type PaymentProviderType =
  | "square"
  | "paypal"
  | "stripe"
  | "flutterwave"
  | "paystack"
  | "mtn-mobile-money"
  | "airtel-money"
  | "mpesa"
  | "bank-transfer";

export interface PaymentProvider {

  id: PaymentProviderType;

  name: string;

  active: boolean;

  supportsSubscriptions: boolean;

  supportsRefunds: boolean;

  supportsCards: boolean;

  supportsMobileMoney: boolean;

  supportedCurrencies: string[];

}

export const paymentProviders: PaymentProvider[] = [

  {
    id: "square",
    name: "Square",

    active: true,

    supportsSubscriptions: true,
    supportsRefunds: true,
    supportsCards: true,
    supportsMobileMoney: false,

    supportedCurrencies: [
      "USD",
      "CAD",
    ],
  },

  {
    id: "paypal",
    name: "PayPal",

    active: false,

    supportsSubscriptions: true,
    supportsRefunds: true,
    supportsCards: true,
    supportsMobileMoney: false,

    supportedCurrencies: [
      "USD",
      "CAD",
      "EUR",
      "GBP",
    ],
  },

  {
    id: "stripe",
    name: "Stripe",

    active: false,

    supportsSubscriptions: true,
    supportsRefunds: true,
    supportsCards: true,
    supportsMobileMoney: false,

    supportedCurrencies: [
      "USD",
      "CAD",
      "EUR",
      "NGN",
      "KES",
      "ZAR",
      "EGP",
      "MAD",
    ],
  },

  {
    id: "flutterwave",
    name: "Flutterwave",

    active: false,

    supportsSubscriptions: true,
    supportsRefunds: true,
    supportsCards: true,
    supportsMobileMoney: true,

    supportedCurrencies: [
      "NGN",
      "USD",
      "UGX",
      "KES",
      "ZAR",
    ],
  },

  {
    id: "paystack",
    name: "Paystack",

    active: false,

    supportsSubscriptions: true,
    supportsRefunds: true,
    supportsCards: true,
    supportsMobileMoney: false,

    supportedCurrencies: [
      "NGN",
      "GHS",
      "ZAR",
    ],
  },

  {
    id: "mtn-mobile-money",
    name: "MTN Mobile Money",

    active: false,

    supportsSubscriptions: false,
    supportsRefunds: false,
    supportsCards: false,
    supportsMobileMoney: true,

    supportedCurrencies: [
      "UGX",
    ],
  },

  {
    id: "airtel-money",
    name: "Airtel Money",

    active: false,

    supportsSubscriptions: false,
    supportsRefunds: false,
    supportsCards: false,
    supportsMobileMoney: true,

    supportedCurrencies: [
      "UGX",
    ],
  },

  {
    id: "mpesa",
    name: "M-Pesa",

    active: false,

    supportsSubscriptions: false,
    supportsRefunds: false,
    supportsCards: false,
    supportsMobileMoney: true,

    supportedCurrencies: [
      "KES",
      "TZS",
    ],
  },

  {
    id: "bank-transfer",
    name: "Bank Transfer",

    active: true,

    supportsSubscriptions: false,
    supportsRefunds: true,
    supportsCards: false,
    supportsMobileMoney: false,

    supportedCurrencies: [
      "USD",
      "CAD",
      "EUR",
      "NGN",
      "UGX",
      "ZAR",
      "EGP",
      "DZD",
      "MAD",
    ],
  },

];
