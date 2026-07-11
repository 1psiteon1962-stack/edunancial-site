import type { EmailCampaign } from "@/lib/emailCampaignTypes";
import type { EmailSubscriber } from "@/lib/emailSubscriberTypes";
import type { EmailTemplate } from "@/lib/emailTemplateTypes";
import type { LearningReminder } from "@/lib/learningReminderTypes";
import type {
  Notification,
  NotificationChannel,
  NotificationPriority,
} from "@/types/notifications";

export interface CommunicationMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ChannelHealth {
  name: string;
  type: NotificationChannel;
  status: "Healthy" | "Monitoring" | "Scheduled";
  throughput: string;
  detail: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  audience: string;
  window: string;
  priority: NotificationPriority;
  summary: string;
  callToAction: string;
  href: string;
}

export interface MessageTemplate extends EmailTemplate {
  channel: NotificationChannel;
  description: string;
  variables: string[];
  owner: string;
}

export interface MemberAlert {
  id: string;
  member: string;
  trigger: string;
  severity: NotificationPriority;
  channel: NotificationChannel;
  status: string;
}

export interface CommunicationReminder extends LearningReminder {
  cadence: string;
  audience: string;
  channel: NotificationChannel;
}

export interface PreferenceGroup {
  title: string;
  description: string;
  items: Array<{
    label: string;
    channel: NotificationChannel;
    enabled: boolean;
    cadence: string;
  }>;
}

export interface SmsHook {
  id: string;
  event: string;
  destination: string;
  status: "Live" | "Queued" | "Fallback";
  description: string;
}

export interface NewsletterIssue {
  id: string;
  title: string;
  audience: string;
  sendWindow: string;
  status: "Draft" | "Ready" | "Scheduled";
  goal: string;
}

export interface OutreachAction {
  title: string;
  description: string;
  href: string;
}

export const communicationMetrics: CommunicationMetric[] = [
  {
    label: "Reachable members",
    value: "12.4K",
    detail: "Unified audience across email, SMS, and in-app channels.",
  },
  {
    label: "Active automations",
    value: "18",
    detail: "Reminder and renewal journeys running every day.",
  },
  {
    label: "Weekly opt-in rate",
    value: "92%",
    detail: "Preference management keeps channel consent visible.",
  },
  {
    label: "Announcements scheduled",
    value: "6",
    detail: "Global, member, and executive announcements queued.",
  },
];

export const channelHealth: ChannelHealth[] = [
  {
    name: "Email notification center",
    type: "email",
    status: "Healthy",
    throughput: "6.4K / day",
    detail: "Handles onboarding, billing, and campaign sends with template reuse.",
  },
  {
    name: "SMS notification hooks",
    type: "sms",
    status: "Monitoring",
    throughput: "1.1K / day",
    detail: "Reserved for urgent reminders, expiring memberships, and event nudges.",
  },
  {
    name: "In-app notification center",
    type: "in-app",
    status: "Healthy",
    throughput: "Real-time",
    detail: "Surfaces contextual alerts, unread actions, and announcement callouts.",
  },
  {
    name: "Newsletter framework",
    type: "newsletter",
    status: "Scheduled",
    throughput: "3 editions / month",
    detail: "Supports segmented digests, accessibility review, and mobile-first copy.",
  },
];

export const announcements: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Financial competency sprint starts Monday",
    audience: "All members",
    window: "Jul 15 - Jul 22",
    priority: "high",
    summary: "Launch week includes daily micro-lessons, one webinar, and achievement reminders.",
    callToAction: "Reserve your spot",
    href: "/events",
  },
  {
    id: "ann-2",
    title: "Executive briefing for enterprise cohorts",
    audience: "Executive members",
    window: "Jul 18",
    priority: "medium",
    summary: "A live overview of portfolio dashboards, growth metrics, and renewal planning.",
    callToAction: "View dashboard",
    href: "/executive",
  },
  {
    id: "ann-3",
    title: "Community office hours with mentors",
    audience: "Community learners",
    window: "Every Thursday",
    priority: "low",
    summary: "Weekly announcement stream ties member alerts to new mentor availability.",
    callToAction: "Open community",
    href: "/community",
  },
];

export const inAppNotifications: Notification[] = [
  {
    id: "note-1",
    userId: "member-101",
    title: "Complete your course checkpoint",
    message: "Section 4 is ready for review and your next badge unlocks after submission.",
    category: "course",
    priority: "high",
    channel: "in-app",
    read: false,
    createdAt: "2026-07-09T03:15:00Z",
    action: { label: "Resume lesson", href: "/courses" },
  },
  {
    id: "note-2",
    userId: "member-101",
    title: "Newsletter preferences updated",
    message: "Your monthly digest is now tailored to investing and business builder content.",
    category: "membership",
    priority: "medium",
    channel: "email",
    read: true,
    createdAt: "2026-07-08T15:45:00Z",
    action: { label: "Review settings", href: "/member/settings" },
  },
  {
    id: "note-3",
    userId: "member-101",
    title: "Assessment reminder queued",
    message: "A same-day SMS reminder will send if your assessment is still incomplete at 6 PM.",
    category: "assessment",
    priority: "medium",
    channel: "sms",
    read: false,
    createdAt: "2026-07-08T11:00:00Z",
    action: { label: "Start assessment", href: "/assessment" },
  },
  {
    id: "note-4",
    userId: "member-101",
    title: "New announcement posted",
    message: "This week’s sprint announcement includes a new webinar schedule and workbook links.",
    category: "announcement",
    priority: "low",
    channel: "newsletter",
    read: false,
    createdAt: "2026-07-07T09:20:00Z",
    action: { label: "Read announcement", href: "/notifications" },
  },
];

export const messageTemplates: MessageTemplate[] = [
  {
    id: "tmpl-1",
    name: "Course completion reminder",
    subject: "Finish this week strong",
    html: "<p>Complete your current lesson to unlock your next milestone.</p>",
    text: "Complete your current lesson to unlock your next milestone.",
    language: "English",
    active: true,
    channel: "email",
    description: "Reusable reminder for members who pause during a lesson sequence.",
    variables: ["firstName", "courseName", "resumeUrl"],
    owner: "Learning Operations",
  },
  {
    id: "tmpl-2",
    name: "Renewal countdown",
    subject: "Membership renewal in 3 days",
    html: "<p>Your plan renews soon. Review benefits and billing before your renewal date.</p>",
    text: "Your plan renews soon. Review benefits and billing before your renewal date.",
    language: "English",
    active: true,
    channel: "sms",
    description: "Short-form member alert mirrored to SMS and in-app delivery.",
    variables: ["firstName", "renewalDate", "billingUrl"],
    owner: "Membership Team",
  },
  {
    id: "tmpl-3",
    name: "Weekly digest",
    subject: "Your Edunancial highlights",
    html: "<p>See your latest progress, new lessons, and announcement highlights.</p>",
    text: "See your latest progress, new lessons, and announcement highlights.",
    language: "English",
    active: true,
    channel: "newsletter",
    description: "Accessible digest template with short sections and stacked mobile layout.",
    variables: ["firstName", "highlights", "announcementUrl"],
    owner: "Content Studio",
  },
];

export const memberAlerts: MemberAlert[] = [
  {
    id: "alert-1",
    member: "Danielle Rivers",
    trigger: "Assessment incomplete for 5 days",
    severity: "high",
    channel: "sms",
    status: "Escalated to reminder engine",
  },
  {
    id: "alert-2",
    member: "Marcus Lee",
    trigger: "Membership renews in 48 hours",
    severity: "critical",
    channel: "email",
    status: "Awaiting billing confirmation",
  },
  {
    id: "alert-3",
    member: "Ava Thompson",
    trigger: "Unread executive briefing announcement",
    severity: "medium",
    channel: "in-app",
    status: "Visible in notification center",
  },
];

export const reminderWorkflows: CommunicationReminder[] = [
  {
    userId: "member-101",
    title: "Daily lesson continuation",
    message: "Prompt members to resume unfinished learning paths before streaks expire.",
    scheduledFor: "Every day at 6:00 PM",
    completed: false,
    cadence: "Daily",
    audience: "Active learners",
    channel: "in-app",
  },
  {
    userId: "member-220",
    title: "Renewal safeguard",
    message: "Send email first, then SMS fallback for members approaching subscription renewal.",
    scheduledFor: "72h and 24h before renewal",
    completed: false,
    cadence: "Lifecycle",
    audience: "Paid members",
    channel: "email",
  },
  {
    userId: "member-401",
    title: "Newsletter re-engagement",
    message: "Re-introduce dormant readers to new content and community highlights.",
    scheduledFor: "First business day each month",
    completed: true,
    cadence: "Monthly",
    audience: "At-risk subscribers",
    channel: "newsletter",
  },
];

export const preferenceGroups: PreferenceGroup[] = [
  {
    title: "Learning updates",
    description: "Course reminders, achievements, and study streak nudges.",
    items: [
      { label: "Email reminders", channel: "email", enabled: true, cadence: "Twice weekly" },
      { label: "SMS escalations", channel: "sms", enabled: true, cadence: "Urgent only" },
      { label: "In-app checkpoints", channel: "in-app", enabled: true, cadence: "Real-time" },
    ],
  },
  {
    title: "Membership & billing",
    description: "Renewal notices, receipts, and plan changes.",
    items: [
      { label: "Billing confirmation", channel: "email", enabled: true, cadence: "Per event" },
      { label: "Renewal fallback text", channel: "sms", enabled: true, cadence: "72h before renewal" },
      { label: "Plan update banners", channel: "in-app", enabled: true, cadence: "As needed" },
    ],
  },
  {
    title: "Community & newsletter",
    description: "Weekly digests, announcements, and office-hours invitations.",
    items: [
      { label: "Monthly newsletter", channel: "newsletter", enabled: true, cadence: "Monthly" },
      { label: "Announcement recaps", channel: "email", enabled: true, cadence: "Weekly" },
      { label: "Community reminders", channel: "in-app", enabled: false, cadence: "Paused" },
    ],
  },
];

export const smsHooks: SmsHook[] = [
  {
    id: "sms-1",
    event: "renewal_due",
    destination: "/api/communications/sms/renewal",
    status: "Live",
    description: "Delivers urgent renewal countdown texts when email remains unopened.",
  },
  {
    id: "sms-2",
    event: "assessment_deadline",
    destination: "/api/communications/sms/assessment",
    status: "Queued",
    description: "Triggers for members who have not resumed assessments after two in-app nudges.",
  },
  {
    id: "sms-3",
    event: "event_checkin",
    destination: "/api/communications/sms/events",
    status: "Fallback",
    description: "Supports same-day reminders for webinars and live cohort sessions.",
  },
];

export const newsletterIssues: NewsletterIssue[] = [
  {
    id: "news-1",
    title: "Wealth Builder Weekly",
    audience: "All active members",
    sendWindow: "Fridays at 8:00 AM",
    status: "Scheduled",
    goal: "Blend announcements, progress highlights, and next-step lessons.",
  },
  {
    id: "news-2",
    title: "Executive Portfolio Brief",
    audience: "Executive cohort",
    sendWindow: "Second Tuesday monthly",
    status: "Ready",
    goal: "Summarize KPI movements, alerts, and strategic recommendations.",
  },
  {
    id: "news-3",
    title: "Family Learning Roundup",
    audience: "Family membership segment",
    sendWindow: "First Monday monthly",
    status: "Draft",
    goal: "Promote family challenges, new lessons, and printable resources.",
  },
];

export const outreachActions: OutreachAction[] = [
  {
    title: "Launch announcement",
    description: "Publish a homepage announcement, queue email, and mirror the message in-app.",
    href: "/notifications",
  },
  {
    title: "Review subscribers",
    description: "Check preference coverage, high-value segments, and newsletter readiness.",
    href: "/admin/subscribers",
  },
  {
    title: "Open member settings",
    description: "Audit channel consent and accessibility-safe cadence for each member segment.",
    href: "/member/settings",
  },
];

export const campaigns: EmailCampaign[] = [
  {
    id: "cmp-1",
    name: "Assessment completion sprint",
    subject: "Finish your next milestone",
    fromName: "Edunancial Learning Team",
    replyTo: "support@edunancial.com",
    scheduledDate: "2026-07-10T13:00:00Z",
    status: "scheduled",
    subscribers: 4200,
    opens: 61,
    clicks: 29,
    conversions: 14,
    revenue: 18000,
  },
  {
    id: "cmp-2",
    name: "Renewal protection journey",
    subject: "Keep your membership active",
    fromName: "Edunancial Membership",
    replyTo: "billing@edunancial.com",
    scheduledDate: "2026-07-11T15:30:00Z",
    status: "sending",
    subscribers: 980,
    opens: 72,
    clicks: 31,
    conversions: 19,
    revenue: 9200,
  },
  {
    id: "cmp-3",
    name: "Community office hours",
    subject: "Meet your mentors this week",
    fromName: "Edunancial Community",
    replyTo: "community@edunancial.com",
    scheduledDate: "2026-07-14T16:00:00Z",
    status: "draft",
    subscribers: 1850,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
  },
];

export const subscribers: EmailSubscriber[] = [
  {
    id: "sub-1",
    firstName: "Danielle",
    lastName: "Rivers",
    email: "danielle@example.com",
    country: "United States",
    region: "North America",
    language: "English",
    leadMagnet: "Assessment Guide",
    source: "Member Dashboard",
    subscribedAt: "2026-01-12",
    status: "active",
    lifetimeValue: 1200,
    customerAcquisitionCost: 42,
  },
  {
    id: "sub-2",
    firstName: "Marcus",
    lastName: "Lee",
    email: "marcus@example.com",
    country: "Canada",
    region: "North America",
    language: "English",
    leadMagnet: "Executive Briefing",
    source: "Newsletter Landing Page",
    subscribedAt: "2026-02-08",
    status: "active",
    lifetimeValue: 3400,
    customerAcquisitionCost: 68,
  },
  {
    id: "sub-3",
    firstName: "Ava",
    lastName: "Thompson",
    email: "ava@example.com",
    country: "United Kingdom",
    region: "Europe",
    language: "English",
    leadMagnet: "Family Learning Pack",
    source: "Community Event",
    subscribedAt: "2026-03-04",
    status: "unsubscribed",
    lifetimeValue: 640,
    customerAcquisitionCost: 37,
  },
];

export function getActiveAnnouncement() {
  return announcements[0];
}

export function getUnreadNotificationCount() {
  return inAppNotifications.filter((notification) => !notification.read).length;
}
