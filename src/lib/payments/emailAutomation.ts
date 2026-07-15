export type PaymentEmailTemplateId =
  | "payment-confirmation"
  | "membership-confirmation"
  | "welcome"
  | "receipt"
  | "renewal-confirmation"
  | "failed-payment"
  | "cancellation-confirmation"
  | "password-reset"
  | "account-recovery";

export interface PaymentEmailEvent {
  id: string;
  templateId: PaymentEmailTemplateId;
  recipientEmail: string;
  membershipPlanId?: string;
  subscriptionId?: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

const paymentEmailEvents: PaymentEmailEvent[] = [];

function createEmailEventId() {
  return `email_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function queuePaymentEmailEvent(
  input: Omit<PaymentEmailEvent, "id" | "createdAt">
) {
  const event: PaymentEmailEvent = {
    ...input,
    id: createEmailEventId(),
    createdAt: new Date().toISOString(),
  };
  paymentEmailEvents.push(event);
  return event;
}

export function listPaymentEmailEvents() {
  return [...paymentEmailEvents];
}

export function resetPaymentEmailEventsForTests() {
  paymentEmailEvents.length = 0;
}
