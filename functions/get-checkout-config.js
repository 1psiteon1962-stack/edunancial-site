import { resolveMirror } from "./resolve-mirror";
import { resolvePayments } from "./resolve-payments";
import { loadPaymentIntent } from "./load-payment-intents";

export function getCheckoutConfig({ hostname, productType }) {
  const mirror = resolveMirror(hostname);
  const paymentMethods = resolvePayments({ mirror, productType });

  return paymentMethods.map(method => ({
    ...method,
    intent: loadPaymentIntent(method.key)
  }));
}
