// Shared TypeScript types for the customer support, communications,
// and notification platform.

export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketCategory =
  | "General"
  | "Membership"
  | "Billing"
  | "Technical"
  | "Course"
  | "Account"
  | "Privacy"
  | "Other";

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  assignedTo?: string;
  attachments: string[];
  internalNotes: string[];
  satisfactionRating?: number;
  resolvedAt?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: "member" | "agent" | "system";
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  relatedArticles: string[];
  updatedAt: string;
  views: number;
}

export interface HelpCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface KBArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  relatedArticles: string[];
  updatedAt: string;
  version: string;
  author: string;
}

export interface KBCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export type NotificationEvent =
  | "welcome"
  | "payment_confirmation"
  | "course_completion"
  | "certificate_earned"
  | "security_alert"
  | "membership_renewal"
  | "password_reset"
  | "new_course"
  | "account_activity"
  | "billing_receipt";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationEvent;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export type NotificationChannel = "email" | "in_app" | "sms" | "push";

export interface CommunicationCategoryPrefs {
  marketing: boolean;
  educationalUpdates: boolean;
  billing: boolean;
  security: boolean;
  productUpdates: boolean;
  newsletter: boolean;
  courseAnnouncements: boolean;
}

export interface CommunicationPreferences {
  userId: string;
  email: CommunicationCategoryPrefs;
  inApp: CommunicationCategoryPrefs;
  sms: CommunicationCategoryPrefs;
  push: CommunicationCategoryPrefs;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  category: string;
}

export interface SupportMetrics {
  openTickets: number;
  avgResponseTime: string;
  satisfactionScore: number;
  resolvedToday: number;
  pendingEscalations: number;
}
