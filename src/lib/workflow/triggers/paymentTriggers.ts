import { TriggerHandler } from "../triggerRegistry";

export const paymentTriggers: TriggerHandler[] = [
  {
    eventType: "payment.received",
    name: "Payment Received",
    description: "Fires when a successful payment is processed",
    payloadSchema: {
      paymentId: "string",
      userId: "string",
      amount: "number",
      currency: "string",
      product: "string",
      paidAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] payment.received", payload.data);
    },
  },
  {
    eventType: "payment.failed",
    name: "Failed Payment",
    description: "Fires when a payment attempt fails",
    payloadSchema: {
      paymentId: "string",
      userId: "string",
      amount: "number",
      currency: "string",
      failureReason: "string",
      failedAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] payment.failed", payload.data);
    },
  },
];
