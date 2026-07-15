import { queuePaymentEmailEvent } from "@/lib/payments/emailAutomation";

type MembershipLifecycleStatus =
  | "active"
  | "cancelled"
  | "past-due"
  | "reactivated"
  | "expired";

export interface MembershipSubscriptionRecord {
  id: string;
  memberId: string;
  memberEmail: string;
  planId: string;
  status: MembershipLifecycleStatus;
  provider: "square";
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  providerPaymentId?: string;
  currentPeriodStart: string;
  currentPeriodEnd?: string;
  updatedAt: string;
}

export interface ProvisionedMember {
  id: string;
  email: string;
  membershipTier: string;
  active: boolean;
  hasDashboardAccess: boolean;
  nextJourneyRoute: string;
  createdAt: string;
  updatedAt: string;
}

export interface LifecycleProcessingResult {
  processed: boolean;
  eventType: string;
  subscriptionId?: string;
  status?: MembershipLifecycleStatus;
  nextJourneyRoute?: string;
}

const subscriptionStore = new Map<string, MembershipSubscriptionRecord>();
const memberStore = new Map<string, ProvisionedMember>();

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getJourneyRoute() {
  return "/welcome?step=dashboard";
}

function upsertMember(email: string, planId: string) {
  const existing = memberStore.get(email.toLowerCase());
  const timestamp = nowIso();
  const member: ProvisionedMember = existing
    ? {
        ...existing,
        membershipTier: planId,
        active: true,
        hasDashboardAccess: true,
        nextJourneyRoute: getJourneyRoute(),
        updatedAt: timestamp,
      }
    : {
        id: createId("member"),
        email,
        membershipTier: planId,
        active: true,
        hasDashboardAccess: true,
        nextJourneyRoute: getJourneyRoute(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
  memberStore.set(email.toLowerCase(), member);
  return member;
}

export function provisionMemberFromPayment(params: {
  email: string;
  planId: string;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  providerPaymentId?: string;
}) {
  const timestamp = nowIso();
  const member = upsertMember(params.email, params.planId);
  const subscription: MembershipSubscriptionRecord = {
    id: createId("sub"),
    memberId: member.id,
    memberEmail: params.email,
    planId: params.planId,
    status: "active",
    provider: "square",
    providerSubscriptionId: params.providerSubscriptionId,
    providerCustomerId: params.providerCustomerId,
    providerPaymentId: params.providerPaymentId,
    currentPeriodStart: timestamp,
    updatedAt: timestamp,
  };
  subscriptionStore.set(subscription.id, subscription);

  queuePaymentEmailEvent({
    templateId: "payment-confirmation",
    recipientEmail: params.email,
    membershipPlanId: params.planId,
    subscriptionId: subscription.id,
  });
  queuePaymentEmailEvent({
    templateId: "membership-confirmation",
    recipientEmail: params.email,
    membershipPlanId: params.planId,
    subscriptionId: subscription.id,
  });
  queuePaymentEmailEvent({
    templateId: "welcome",
    recipientEmail: params.email,
    membershipPlanId: params.planId,
    subscriptionId: subscription.id,
  });
  queuePaymentEmailEvent({
    templateId: "receipt",
    recipientEmail: params.email,
    membershipPlanId: params.planId,
    subscriptionId: subscription.id,
  });

  return {
    member,
    subscription,
    nextJourneyRoute: member.nextJourneyRoute,
  };
}

function findSubscriptionByProviderId(providerSubscriptionId?: string) {
  if (!providerSubscriptionId) return undefined;
  return [...subscriptionStore.values()].find(
    (record) => record.providerSubscriptionId === providerSubscriptionId
  );
}

function updateSubscriptionStatus(
  subscription: MembershipSubscriptionRecord,
  status: MembershipLifecycleStatus,
  params: { planId?: string; periodEnd?: string } = {}
) {
  const updated: MembershipSubscriptionRecord = {
    ...subscription,
    status,
    planId: params.planId ?? subscription.planId,
    currentPeriodEnd: params.periodEnd ?? subscription.currentPeriodEnd,
    updatedAt: nowIso(),
  };
  subscriptionStore.set(updated.id, updated);

  const member = upsertMember(updated.memberEmail, updated.planId);
  if (status === "cancelled" || status === "expired") {
    member.active = false;
    member.updatedAt = nowIso();
    memberStore.set(member.email.toLowerCase(), member);
  }

  return updated;
}

export function processSquareLifecycleEvent(event: {
  type?: string;
  data?: {
    object?: Record<string, unknown>;
  };
}): LifecycleProcessingResult {
  const eventType = event.type ?? "unknown";
  const object = event.data?.object ?? {};
  const subscriptionReference =
    (object.subscription_id as string | undefined) ??
    (object.id as string | undefined);
  const email =
    (object.customer_email as string | undefined) ??
    (object.email_address as string | undefined);
  const planId =
    (object.plan_id as string | undefined) ??
    (object.membership_plan_id as string | undefined) ??
    "basic";

  switch (eventType) {
    case "payment.completed": {
      if (!email) {
        return { processed: false, eventType };
      }
      const provisioned = provisionMemberFromPayment({
        email,
        planId,
        providerSubscriptionId: subscriptionReference,
        providerPaymentId: object.payment_id as string | undefined,
        providerCustomerId: object.customer_id as string | undefined,
      });
      return {
        processed: true,
        eventType,
        subscriptionId: provisioned.subscription.id,
        status: "active",
        nextJourneyRoute: provisioned.nextJourneyRoute,
      };
    }
    case "subscription.created":
    case "subscription.updated": {
      const existing = findSubscriptionByProviderId(subscriptionReference);
      if (!existing) return { processed: false, eventType };
      const updated = updateSubscriptionStatus(existing, "active", { planId });
      queuePaymentEmailEvent({
        templateId: "renewal-confirmation",
        recipientEmail: updated.memberEmail,
        membershipPlanId: updated.planId,
        subscriptionId: updated.id,
      });
      return {
        processed: true,
        eventType,
        subscriptionId: updated.id,
        status: updated.status,
        nextJourneyRoute: getJourneyRoute(),
      };
    }
    case "subscription.deactivated": {
      const existing = findSubscriptionByProviderId(subscriptionReference);
      if (!existing) return { processed: false, eventType };
      const updated = updateSubscriptionStatus(existing, "cancelled");
      queuePaymentEmailEvent({
        templateId: "cancellation-confirmation",
        recipientEmail: updated.memberEmail,
        membershipPlanId: updated.planId,
        subscriptionId: updated.id,
      });
      return {
        processed: true,
        eventType,
        subscriptionId: updated.id,
        status: updated.status,
      };
    }
    case "payment.updated": {
      const status = String(object.status ?? "").toUpperCase();
      const existing = findSubscriptionByProviderId(subscriptionReference);
      if (!existing) return { processed: false, eventType };

      if (status === "FAILED") {
        const updated = updateSubscriptionStatus(existing, "past-due");
        queuePaymentEmailEvent({
          templateId: "failed-payment",
          recipientEmail: updated.memberEmail,
          membershipPlanId: updated.planId,
          subscriptionId: updated.id,
        });
        return {
          processed: true,
          eventType,
          subscriptionId: updated.id,
          status: updated.status,
        };
      }

      if (status === "COMPLETED") {
        const updated = updateSubscriptionStatus(existing, "reactivated");
        queuePaymentEmailEvent({
          templateId: "renewal-confirmation",
          recipientEmail: updated.memberEmail,
          membershipPlanId: updated.planId,
          subscriptionId: updated.id,
        });
        return {
          processed: true,
          eventType,
          subscriptionId: updated.id,
          status: updated.status,
          nextJourneyRoute: getJourneyRoute(),
        };
      }

      return { processed: false, eventType };
    }
    default:
      return { processed: false, eventType };
  }
}

export function listMembershipSubscriptions() {
  return [...subscriptionStore.values()];
}

export function listProvisionedMembers() {
  return [...memberStore.values()];
}

export function resetMembershipLifecycleForTests() {
  subscriptionStore.clear();
  memberStore.clear();
}
