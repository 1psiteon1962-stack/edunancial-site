import providers from "../data/payments/provider.json";
import productRules from "../data/payments/product-rules.json";
import mirrors from "../data/payments/mirrors.json";

export function resolvePayments({ mirror, productType }) {
  const mirrorConfig = mirrors[mirror];
  if (!mirrorConfig) return [];

  const allowedByProduct = productRules[productType] || [];
  const allowedByMirror = mirrorConfig.providers || [];

  const allowed = allowedByProduct.filter(p =>
    allowedByMirror.includes(p)
  );

  return allowed.map(key => ({
    key,
    ...providers[key]
  }));
}
