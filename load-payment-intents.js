import intents from "../data/payments/intent-placeholders.json";

export function loadPaymentIntent(providerKey) {
  return intents[providerKey] || null;
}
