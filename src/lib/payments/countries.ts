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
      "stripe",
      "bank-transfer",
    ],
  },

  {
    countryId: "za",

    currency: "ZAR",

    defaultProvider: "flutterwave",

    providers: [
      "flutterwave",
      "paystack",
      "stripe",
      "bank-transfer",
    ],
  },

  {
    countryId: "eg",

    currency: "EGP",

    defaultProvider: "stripe",

    providers: [
      "stripe",
      "bank-transfer",
    ],
  },

  {
    countryId: "ma",

    currency: "MAD",

    defaultProvider: "stripe",

    providers: [
      "stripe",
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
    countryId: "fr",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "de",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "it",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "nl",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "be",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "pt",
    currency: "EUR",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "gb",
    currency: "GBP",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "ch",
    currency: "CHF",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "pl",
    currency: "PLN",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "cz",
    currency: "CZK",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "hu",
    currency: "HUF",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
  },

  {
    countryId: "ro",
    currency: "RON",
    defaultProvider: "stripe",
    providers: ["stripe", "paypal", "bank-transfer"],
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
