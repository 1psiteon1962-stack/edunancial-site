/** Client-safe: countries whose checkout goes through Stripe, with the currency Stripe must charge. */
export const STRIPE_CHECKOUT_COUNTRIES: Readonly<Record<string, string>> = Object.freeze({ CA: "CAD" });

export function isStripeCheckoutCountry(countryCode: string | null | undefined): boolean {
  return Boolean(countryCode && STRIPE_CHECKOUT_COUNTRIES[String(countryCode).trim().toUpperCase()]);
}

export function checkoutEndpointForCountry(countryCode: string | null | undefined): string {
  return isStripeCheckoutCountry(countryCode) ? "/api/stripe/checkout" : "/api/square/payment-link";
}
