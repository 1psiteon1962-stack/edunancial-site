import type {
  Notification,
  NotificationChannel,
  NotificationEvent,
} from "@/types/support";
import { getTemplate, renderTemplate } from "@/lib/email-templates";

// This module is an architecture stub for the notification pipeline.
// In production, each `send*` method would call a real provider
// (SendGrid/SES for email, Twilio for SMS, FCM/APNs for push) and
// `sendInApp` would persist to the database and push over a websocket.

interface NotificationEventMeta {
  label: string;
  description: string;
  defaultChannels: NotificationChannel[];
}

export const notificationEvents: Record<NotificationEvent, NotificationEventMeta> = {
  welcome: {
    label: "Welcome",
    description: "Sent once when a member creates an account.",
    defaultChannels: ["email", "in_app"],
  },
  payment_confirmation: {
    label: "Payment Confirmation",
    description: "Sent after a successful charge.",
    defaultChannels: ["email", "in_app"],
  },
  course_completion: {
    label: "Course Completion",
    description: "Sent when a member finishes a course.",
    defaultChannels: ["email", "in_app", "push"],
  },
  certificate_earned: {
    label: "Certificate Earned",
    description: "Sent when a certificate is issued.",
    defaultChannels: ["email", "in_app"],
  },
  security_alert: {
    label: "Security Alert",
    description: "Sent for new sign-ins or suspicious activity.",
    defaultChannels: ["email", "in_app", "sms"],
  },
  membership_renewal: {
    label: "Membership Renewal",
    description: "Sent ahead of an upcoming renewal charge.",
    defaultChannels: ["email", "in_app"],
  },
  password_reset: {
    label: "Password Reset",
    description: "Sent when a password reset is requested or completed.",
    defaultChannels: ["email"],
  },
  new_course: {
    label: "New Course Available",
    description: "Sent when a course matching a member's interests launches.",
    defaultChannels: ["email", "in_app", "push"],
  },
  account_activity: {
    label: "Account Activity",
    description: "Sent for general account changes like profile edits.",
    defaultChannels: ["in_app"],
  },
  billing_receipt: {
    label: "Billing Receipt",
    description: "Sent with a copy of a receipt after purchase.",
    defaultChannels: ["email", "in_app"],
  },
};

class NotificationServiceImpl {
  /**
   * Fan out a notification event across the requested channels, respecting
   * each user's communication preferences.
   */
  async send(
    userId: string,
    event: NotificationEvent,
    data: Record<string, string>,
    channels: NotificationChannel[]
  ): Promise<void> {
    const meta = notificationEvents[event];

    for (const channel of channels) {
      const allowed = await this.checkPreferences(userId, event, channel);
      if (!allowed) {
        continue;
      }

      switch (channel) {
        case "email":
          await this.sendEmail(data.email ?? "", event, data);
          break;
        case "in_app":
          await this.sendInApp(userId, {
            userId,
            type: event,
            title: meta.label,
            message: data.message ?? meta.description,
            read: false,
          });
          break;
        case "sms":
          await this.sendSMS(data.phone ?? "", data.message ?? meta.description);
          break;
        case "push":
          await this.sendPush(userId, meta.label, data.message ?? meta.description);
          break;
      }
    }
  }

  /** Render an email template and hand it off to the email provider. */
  async sendEmail(
    to: string,
    templateId: string,
    vars: Record<string, string>
  ): Promise<void> {
    const template = getTemplate(templateId);
    if (!template) {
      console.warn(`[notifications] Unknown email template: ${templateId}`);
      return;
    }

    const rendered = renderTemplate(template, vars);
    // TODO: Replace with a real transactional email provider call
    // (e.g. SendGrid, Amazon SES, Postmark).
    console.info(`[notifications] sendEmail -> ${to}`, rendered.subject);
  }

  /** Persist an in-app notification for the user's notification center. */
  async sendInApp(
    userId: string,
    notification: Omit<Notification, "id" | "createdAt">
  ): Promise<void> {
    // TODO: Persist to the database and push over a websocket/SSE channel
    // so the notification center updates in real time.
    console.info(`[notifications] sendInApp -> ${userId}`, notification.title);
  }

  /** Send an SMS message via a carrier provider. */
  async sendSMS(phone: string, message: string): Promise<void> {
    // TODO: Integrate with an SMS provider such as Twilio or Amazon SNS.
    console.info(`[notifications] sendSMS -> ${phone}`, message);
  }

  /** Send a push notification to a user's registered devices. */
  async sendPush(userId: string, title: string, body: string): Promise<void> {
    // TODO: Integrate with a push provider such as Firebase Cloud Messaging
    // or Apple Push Notification service.
    console.info(`[notifications] sendPush -> ${userId}`, title, body);
  }

  /**
   * Check whether a user has opted into a given channel for a given event.
   * Always returns true in this stub; a real implementation would look up
   * the user's CommunicationPreferences record.
   */
  async checkPreferences(
    userId: string,
    event: NotificationEvent,
    channel: NotificationChannel
  ): Promise<boolean> {
    void userId;
    void event;
    void channel;
    return true;
  }
}

export const NotificationService = new NotificationServiceImpl();
