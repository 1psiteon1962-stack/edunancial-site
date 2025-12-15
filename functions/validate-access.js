import products from "../data/products/us.json";
import mirrors from "../data/payments/mirrors.json";
import productRules from "../data/payments/product-rules.json";

export function validateAccess({ mirror, productKey }) {
  const product = products[productKey];
  if (!product) {
    return { allowed: false, reason: "Invalid product." };
  }

  const mirrorConfig = mirrors[mirror];
  if (!mirrorConfig) {
    return { allowed: false, reason: "Invalid region." };
  }

  const allowedPayments = productRules[product.type];
  if (!allowedPayments || allowedPayments.length === 0) {
    return { allowed: false, reason: "No payment methods available." };
  }

  return { allowed: true };
}
