export const squareConfig = {
  applicationId:
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "",

  locationId:
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "",

  environment:
    process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "production",
};

export function getSquareCheckoutUrl(
  checkoutUrl: string
) {
  return checkoutUrl;
}

export function validateSquareConfig() {
  return (
    squareConfig.applicationId.length > 0 &&
    squareConfig.locationId.length > 0
  );
}
