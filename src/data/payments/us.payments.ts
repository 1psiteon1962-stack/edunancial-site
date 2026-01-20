export type PaymentPlan = {
  id: string;
  price: number;
  currency: string;
};

export const US_PAYMENTS: PaymentPlan[] = [
  { id: "basic", price: 9.99, currency: "USD" },
  { id: "pro", price: 49.99, currency: "USD" }
];
