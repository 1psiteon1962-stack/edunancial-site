import { createHmac, timingSafeEqual } from "node:crypto";

export const squareConfig = {
  applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "",
  locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "",
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "production",
  accessToken: process.env.SQUARE_ACCESS_TOKEN || "",
  webhookSignatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || "",
  webhookNotificationUrl: process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || "",
};

export function getSquareCheckoutUrl(
  checkoutUrl: string
) {
  return checkoutUrl;
}

export function validateSquareConfig() {
  return (
    squareConfig.applicationId.length > 0 &&
    squareConfig.locationId.length > 0 &&
    squareConfig.accessToken.length > 0
  );
}

export function hasSquareWebhookVerificationConfig() {
  return (
    squareConfig.webhookSignatureKey.length > 0 &&
    squareConfig.webhookNotificationUrl.length > 0
  );
}

export function isSquareVerifiedCheckoutEnabled() {
  return (
    process.env.SQUARE_VERIFIED_CHECKOUT_ENABLED === "true" &&
    validateSquareConfig() &&
    hasSquareWebhookVerificationConfig()
  );
}

export function verifySquareWebhookSignature(
  body: string,
  signatureHeader: string | null
) {
  if (!hasSquareWebhookVerificationConfig() || !signatureHeader) {
    return false;
  }

  const expectedSignature = createHmac(
    "sha256",
    squareConfig.webhookSignatureKey
  )
    .update(`${squareConfig.webhookNotificationUrl}${body}`)
    .digest("base64");

  const provided = Buffer.from(signatureHeader.trim());
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}
