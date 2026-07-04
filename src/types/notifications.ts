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
  | "executive";

export interface Notification {

  id: string;

  title: string;

  message: string;

  category: NotificationCategory;

  priority: NotificationPriority;

  read: boolean;

  createdAt: Date;

  actionUrl?: string;

}
