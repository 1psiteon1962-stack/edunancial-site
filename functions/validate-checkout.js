export function validateCheckout({ region, product, providers }) {
  if (!providers || providers.length === 0) {
    throw new Error("No payment providers available.");
  }

  return {
    allowed: true,
    region,
    product,
    providers
  };
}
