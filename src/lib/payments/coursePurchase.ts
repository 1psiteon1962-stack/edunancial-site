import { addPurchase, hasPurchased, type Purchase } from "@/lib/purchases";
import { queuePaymentEmailEvent } from "@/lib/payments/emailAutomation";

export interface CoursePurchaseParams {
  customerEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  squareTransactionId: string;
  squarePaymentId?: string;
  squareCustomerId?: string;
}

export interface CoursePurchaseResult {
  purchase: Purchase;
  alreadyOwned: boolean;
}

function createPurchaseId() {
  return `purchase_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function recordCoursePurchase(
  params: CoursePurchaseParams
): CoursePurchaseResult {
  const alreadyOwned = hasPurchased(params.customerEmail, params.courseId);

  if (alreadyOwned) {
    const existing = { id: "existing", productId: params.courseId, customerEmail: params.customerEmail, purchaseDate: new Date().toISOString(), squareTransactionId: params.squareTransactionId };
    return { purchase: existing, alreadyOwned: true };
  }

  const purchase: Purchase = {
    id: createPurchaseId(),
    productId: params.courseId,
    customerEmail: params.customerEmail,
    purchaseDate: new Date().toISOString(),
    squareTransactionId: params.squareTransactionId,
  };

  addPurchase(purchase);

  queuePaymentEmailEvent({
    templateId: "payment-confirmation",
    recipientEmail: params.customerEmail,
    metadata: {
      courseId: params.courseId,
      courseName: params.courseName,
      amount: String(params.amount),
      currency: params.currency,
    },
  });

  return { purchase, alreadyOwned: false };
}

export function customerHasCourseAccess(
  customerEmail: string,
  courseId: string
): boolean {
  return hasPurchased(customerEmail, courseId);
}
