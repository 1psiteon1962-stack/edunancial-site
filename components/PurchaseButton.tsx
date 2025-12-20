// components/PurchaseButton.tsx
"use client";

import { canPurchase } from "@/lib/level-guard";
import { Product } from "@/data/products";

interface Props {
  product: Product;
  userLevel: number;
}

export default function PurchaseButton({ product, userLevel }: Props) {
  if (!canPurchase(userLevel as any, product.key)) {
    return <p>Upgrade literacy level to access</p>;
  }

  return (
    <button
      style={{
        padding: "12px 18px",
        background: "#111",
        color: "#fff",
        borderRadius: 6,
        opacity: product.placeholder ? 0.6 : 1,
      }}
      disabled={product.placeholder}
    >
      {product.placeholder ? "Coming Soon" : `Buy $${product.priceUSD}`}
    </button>
  );
}
