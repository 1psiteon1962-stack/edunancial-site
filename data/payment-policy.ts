// data/payment-policy.ts

export const PaymentPolicy = {
  allowedProviders: {
    US: ["stripe", "square"],
    AFRICA: ["flutterwave", "paystack"],
    ASIA: ["stripe"],
    CRYPTO: ["usdc", "usdt"],
  },
  rules: {
    noPaymentWithoutLevel: true,
    noBypassViaPartner: true,
    noAutoEnrollment: true,
  },
  settlement: {
    mirrorsReportToUS: true,
    currencyConversionAtUS: true,
  },
  status: {
    live: false, // PLACEHOLDER until you give credentials
  },
};
