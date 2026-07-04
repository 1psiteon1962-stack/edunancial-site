export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface PaymentTransaction {

  id: string;

  memberId: string;

  provider: string;

  amount: number;

  currency: string;

  status: TransactionStatus;

  createdAt: Date;

  referenceNumber: string;

}

export const paymentTransactions: PaymentTransaction[] = [];

export function addTransaction(
  transaction: PaymentTransaction
) {
  paymentTransactions.push(transaction);
}

export function findTransaction(
  id: string
) {
  return paymentTransactions.find(
    transaction => transaction.id === id
  );
}
