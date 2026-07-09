export type NotificationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type NotificationCategory =
  | "membership"
  | "assessment"
  | "course"
  | "marketplace"
  | "payment"
  | "system"
  | "ai"
  | "executive"
  | "community"
  | "announcement";

export type NotificationChannel =
  | "email"
  | "sms"
  | "in-app"
  | "newsletter";

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channel: NotificationChannel;
  read: boolean;
  createdAt: string;
  action?: NotificationAction;
}
