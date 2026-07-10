/**
 * Webhook event type catalogue.
 * All event types follow the pattern: resource.action
 */

// ─── Event type constants ─────────────────────────────────────────────────────

export const WebhookEventType = {
  // Membership
  MEMBERSHIP_CREATED: "membership.created",
  MEMBERSHIP_UPDATED: "membership.updated",
  MEMBERSHIP_CANCELLED: "membership.cancelled",
  MEMBERSHIP_EXPIRED: "membership.expired",

  // Billing
  BILLING_INVOICE_CREATED: "billing.invoice.created",
  BILLING_INVOICE_PAID: "billing.invoice.paid",
  BILLING_INVOICE_FAILED: "billing.invoice.failed",
  BILLING_SUBSCRIPTION_CREATED: "billing.subscription.created",
  BILLING_SUBSCRIPTION_UPDATED: "billing.subscription.updated",
  BILLING_SUBSCRIPTION_CANCELLED: "billing.subscription.cancelled",

  // Payment
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_REFUNDED: "payment.refunded",

  // Course / Learning
  COURSE_ENROLLED: "course.enrolled",
  COURSE_COMPLETED: "course.completed",
  COURSE_PROGRESS_UPDATED: "course.progress.updated",

  // Certificate
  CERTIFICATE_GENERATED: "certificate.generated",
  CERTIFICATE_REVOKED: "certificate.revoked",

  // Administrative
  ADMIN_USER_CREATED: "admin.user.created",
  ADMIN_USER_UPDATED: "admin.user.updated",
  ADMIN_USER_DELETED: "admin.user.deleted",
  ADMIN_ROLE_CHANGED: "admin.role.changed",

  // Notification
  NOTIFICATION_SENT: "notification.sent",
  NOTIFICATION_FAILED: "notification.failed",
} as const;

export type WebhookEventType = (typeof WebhookEventType)[keyof typeof WebhookEventType];

// ─── Payload types ────────────────────────────────────────────────────────────

export interface WebhookPayload<T = unknown> {
  /** Unique event ID (used for replay protection) */
  id: string;
  /** ISO 8601 timestamp when event occurred */
  timestamp: string;
  type: WebhookEventType;
  data: T;
  /** API version that generated this event */
  apiVersion?: string;
}

// Per-event data shapes

export interface MembershipEventData {
  memberId: string;
  userId: string;
  plan: string;
  status: string;
}

export interface PaymentEventData {
  paymentId: string;
  amount: number;
  currency: string;
  customerId?: string;
  status: string;
  provider: string;
}

export interface CourseEventData {
  userId: string;
  courseId: string;
  percent?: number;
  completedAt?: string;
}

export interface CertificateEventData {
  certificateId: string;
  userId: string;
  courseId: string;
  url: string;
}

export interface AdminEventData {
  actorId: string;
  targetId: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationEventData {
  notificationId: string;
  channel: "email" | "sms" | "push";
  recipientId: string;
  templateId?: string;
}

// ─── Outgoing webhook subscription ───────────────────────────────────────────

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  ownerId: string;
  enabled: boolean;
  createdAt: string;
}
