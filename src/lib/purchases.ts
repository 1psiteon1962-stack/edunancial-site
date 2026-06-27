export interface Purchase {

  id: string;

  productId: string;

  customerEmail: string;

  purchaseDate: string;

  squareTransactionId: string;

}

export const purchases: Purchase[] = [];

export function hasPurchased(
  email: string,
  productId: string
): boolean {

  return purchases.some(
    purchase =>
      purchase.customerEmail === email &&
      purchase.productId === productId
  );

}

export function addPurchase(
  purchase: Purchase
) {

  purchases.push(purchase);

}
