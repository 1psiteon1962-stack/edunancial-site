import { PaymentProviderType } from "./providers";

export interface CountryPaymentConfiguration {

  countryId: string;

  currency: string;

  defaultProvider: PaymentProviderType;

  providers: PaymentProviderType[];

}

export const countryPayments: CountryPaymentConfiguration[] = [

  {
    countryId: "us",

    currency: "USD",

    defaultProvider: "square",

    providers: [
      "square",
      "bank-transfer",
    ],
  },

  {
    countryId: "ca",

    currency: "CAD",

    defaultProvider: "square",

    providers: [
      "square",
      "bank-transfer",
    ],
  },

  {
    countryId: "ug",

    currency: "UGX",

    defaultProvider: "mtn-mobile-money",

    providers: [
      "mtn-mobile-money",
      "airtel-money",
      "flutterwave",
      "bank-transfer",
    ],
  },

  {
    countryId: "ng",

    currency: "NGN",

    defaultProvider: "paystack",

    providers: [
      "paystack",
      "flutterwave",
      "bank-transfer",
    ],
  },

  {
    countryId: "za",

    currency: "ZAR",

    defaultProvider: "flutterwave",

    providers: [
      "flutterwave",
      "bank-transfer",
    ],
  },

  {
    countryId: "es",

    currency: "EUR",

    defaultProvider: "stripe",

    providers: [
      "stripe",
      "paypal",
      "bank-transfer",
    ],
  },

  {
    countryId: "do",

    currency: "DOP",

    defaultProvider: "paypal",

    providers: [
      "paypal",
      "bank-transfer",
    ],
  },

];
