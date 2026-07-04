export type SubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "past-due";

export interface Subscription {

  id: string;

  memberId: string;

  membershipPlan: string;

  paymentProvider: string;

  startDate: Date;

  renewalDate: Date;

  status: SubscriptionStatus;

}

export const subscriptions: Subscription[] = [];

export function getSubscription(
  memberId: string
) {
  return subscriptions.find(
    subscription =>
      subscription.memberId === memberId
  );
}

export function addSubscription(
  subscription: Subscription
) {
  subscriptions.push(subscription);
}
