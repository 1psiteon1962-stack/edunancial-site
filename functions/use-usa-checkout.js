import pricing from "../data/pricing/us.json";
import products from "../data/products/us.json";
import { getCheckoutConfig } from "./get-checkout-config";
import { validateAccess } from "./validate-access";

export function useUsaCheckout({ hostname, productKey }) {
  const product = products[productKey];
  if (!product) {
    return { error: "Product not found." };
  }

  const access = validateAccess({
    mirror: "us",
    productKey
  });

  if (!access.allowed) {
    return { error: access.reason };
  }

  const checkoutConfig = getCheckoutConfig({
    hostname,
    productType: product.type
  });

  const price = pricing[product.type]?.[product.tier || "default"] || null;

  return {
    product,
    price,
    paymentOptions: checkoutConfig
  };
}
