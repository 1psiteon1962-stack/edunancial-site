import { NextResponse } from "next/server";

import {
  buildRateLimitKey,
  isRateLimited,
  readJsonBody,
  sanitizeText,
  withApiHeaders,
} from "@/lib/api/security";
import { products } from "@/lib/products";

type CheckoutRequestBody = {
  id?: string;
  name?: string;
  price?: number;
};

export async function POST(request: Request) {
  const key = buildRateLimitKey("square-checkout", request);

  if (isRateLimited(key, { limit: 15, windowMs: 60_000 })) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Too many checkout attempts" },
        { status: 429 }
      )
    );
  }

  const body = await readJsonBody<CheckoutRequestBody>(request);
  const productId = sanitizeText(body?.id, 80);

  if (!productId) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "A valid product id is required" },
        { status: 400 }
      )
    );
  }

  const product = products.find((entry) => entry.id === productId);
  const sanitizedName = sanitizeText(body?.name, 120);
  const requestedPrice =
    typeof body?.price === "number" && Number.isFinite(body.price)
      ? body.price
      : null;

  if (requestedPrice != null && requestedPrice < 0) {
    return withApiHeaders(
      NextResponse.json(
        { success: false, error: "Invalid checkout amount" },
        { status: 400 }
      )
    );
  }

  const checkoutUrl =
    product?.checkoutUrl?.trim() || `/checkout?product=${encodeURIComponent(productId)}`;

  return withApiHeaders(
    NextResponse.json({
      success: true,
      checkoutUrl,
      product: {
        id: productId,
        title: product?.title ?? sanitizedName ?? "Edunancial purchase",
        price: product?.price ?? requestedPrice ?? null,
      },
    })
  );
}
