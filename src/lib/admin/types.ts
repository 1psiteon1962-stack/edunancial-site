// Shared TypeScript types for the Edunancial Admin Portal & CMS.

export type AdminRole =
  | "super_admin"
  | "admin"
  | "content_manager"
  | "instructor"
  | "support"
  | "marketing"
  | "analyst";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin: string;
  status: "active" | "suspended";
}

export interface Permission {
  action: "view" | "create" | "edit" | "delete" | "export" | "manage";
  resource: string;
}

export interface RoleConfig {
  role: AdminRole;
  label: string;
  description: string;
  color: string;
  permissions: Permission[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipLevel: "free" | "basic" | "premium" | "elite" | "enterprise";
  role: "member" | "instructor" | "admin";
  status: "active" | "suspended" | "pending";
  joinedAt: string;
  lastLoginAt: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalSpent: number;
  country: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  instructor: string;
  status: "draft" | "review" | "published" | "archived" | "scheduled";
  publishedAt?: string;
  scheduledAt?: string;
  enrollments: number;
  completions: number;
  rating: number;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  lessons: number;
  duration: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: "blog" | "news" | "faq" | "landing" | "legal" | "resource";
  status: "draft" | "review" | "published" | "archived";
  author: string;
  excerpt?: string;
  body?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  categories: string[];
  tags: string[];
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  type: "image" | "pdf" | "video" | "audio" | "worksheet" | "other";
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  usedIn: string[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  category: "content" | "user" | "permission" | "billing" | "system";
}

export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  newRegistrations: number;
  subscriptionRevenue: number;
  courseEnrollments: number;
  courseCompletions: number;
  calculatorUsage: number;
  websiteTraffic: number;
  supportTickets: number;
  recentActivity: AuditLog[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  billingCycle: "monthly" | "annual" | "lifetime";
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  memberCount: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  siteName: string;
  siteTagline: string;
  primaryColor: string;
  logo: string;
  favicon: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  seoDefaults: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  featureFlags: Record<string, boolean>;
  emailSettings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    provider: string;
  };
  notificationSettings: {
    newMember: boolean;
    newEnrollment: boolean;
    paymentReceived: boolean;
    supportTicket: boolean;
    systemAlert: boolean;
  };
  membershipPlans: MembershipPlan[];
}
