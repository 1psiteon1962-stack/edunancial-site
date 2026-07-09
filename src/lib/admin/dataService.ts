import type {
  AuditLog,
  ContentItem,
  Course,
  DashboardMetrics,
  Member,
  MediaItem,
  RoleConfig,
  SystemConfig,
} from "./types";
import {
  getMockAuditLogs,
  getMockContentItems,
  getMockCourses,
  getMockDashboardMetrics,
  getMockMediaItems,
  getMockMembers,
} from "./mockData";
import { ROLE_CONFIGS } from "./permissions";

// -----------------------------------------------------------------------
// In-memory stores. TODO: Replace mock implementations with real API calls
// once the backend service layer is available. Every method below returns
// a Promise so call sites are already async/await ready for that swap.
// -----------------------------------------------------------------------

let membersStore: Member[] = getMockMembers(25);
let coursesStore: Course[] = getMockCourses(15);
let contentStore: ContentItem[] = getMockContentItems(20);
let mediaStore: MediaItem[] = getMockMediaItems(20);
const auditStore: AuditLog[] = getMockAuditLogs(50);
let roleStore: RoleConfig[] = ROLE_CONFIGS;

let configStore: SystemConfig = {
  maintenanceMode: false,
  maintenanceMessage: "Edunancial is currently undergoing scheduled maintenance. We'll be back shortly.",
  siteName: "Edunancial",
  siteTagline: "Financial Literacy & Financial Competency",
  primaryColor: "#2563eb",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr", "es", "pt", "sw"],
  seoDefaults: {
    title: "Edunancial | Financial Literacy & Financial Competency",
    description: "Build financial competency through real estate, paper assets, and business education.",
    keywords: ["financial literacy", "financial competency", "edunancial"],
    ogImage: "/og-image.png",
  },
  featureFlags: {
    ai_coach_enabled: true,
    marketplace_enabled: true,
    community_forum_enabled: false,
    voice_assistant_enabled: false,
    certificate_generation: true,
    global_expansion: true,
    analytics_beta: false,
    multi_tenant_mode: false,
  },
  emailSettings: {
    fromName: "Edunancial",
    fromEmail: "no-reply@edunancial.com",
    replyTo: "support@edunancial.com",
    provider: "SendGrid",
  },
  notificationSettings: {
    newMember: true,
    newEnrollment: true,
    paymentReceived: true,
    supportTicket: true,
    systemAlert: true,
  },
  membershipPlans: [
    { id: "plan-free", name: "Free", slug: "free", price: 0, billingCycle: "monthly", features: ["Access to free courses", "Community access"], isActive: true, isPopular: false, memberCount: 6820 },
    { id: "plan-basic", name: "Basic", slug: "basic", price: 19, billingCycle: "monthly", features: ["All Free features", "10 premium courses", "Downloadable worksheets"], isActive: true, isPopular: false, memberCount: 3120 },
    { id: "plan-premium", name: "Premium", slug: "premium", price: 49, billingCycle: "monthly", features: ["All Basic features", "Unlimited courses", "1:1 monthly coaching call"], isActive: true, isPopular: true, memberCount: 2140 },
    { id: "plan-elite", name: "Elite", slug: "elite", price: 99, billingCycle: "monthly", features: ["All Premium features", "Weekly group coaching", "Priority support"], isActive: true, isPopular: false, memberCount: 612 },
    { id: "plan-enterprise", name: "Enterprise", slug: "enterprise", price: 499, billingCycle: "annual", features: ["Team seats", "Custom onboarding", "Dedicated account manager"], isActive: true, isPopular: false, memberCount: 155 },
  ],
};

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function toCSV<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  return lines.join("\n");
}

export interface MemberFilters {
  search?: string;
  status?: string;
  membershipLevel?: string;
  role?: string;
}

function filterMembers(members: Member[], filters?: MemberFilters): Member[] {
  if (!filters) return members;
  return members.filter((m) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.status && filters.status !== "all" && m.status !== filters.status) return false;
    if (
      filters.membershipLevel &&
      filters.membershipLevel !== "all" &&
      m.membershipLevel !== filters.membershipLevel
    )
      return false;
    if (filters.role && filters.role !== "all" && m.role !== filters.role) return false;
    return true;
  });
}

export interface CourseFilters {
  search?: string;
  status?: string;
  category?: string;
}

function filterCourses(courses: Course[], filters?: CourseFilters): Course[] {
  if (!filters) return courses;
  return courses.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.title.toLowerCase().includes(q)) return false;
    }
    if (filters.status && filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.category && filters.category !== "all" && c.category !== filters.category) return false;
    return true;
  });
}

export interface ContentFilters {
  search?: string;
  status?: string;
  type?: string;
  author?: string;
}

function filterContent(items: ContentItem[], filters?: ContentFilters): ContentItem[] {
  if (!filters) return items;
  return items.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.title.toLowerCase().includes(q)) return false;
    }
    if (filters.status && filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.type && filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.author && filters.author !== "all" && c.author !== filters.author) return false;
    return true;
  });
}

export interface MediaFilters {
  search?: string;
  type?: string;
}

function filterMedia(items: MediaItem[], filters?: MediaFilters): MediaItem[] {
  if (!filters) return items;
  return items.filter((m) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!m.filename.toLowerCase().includes(q)) return false;
    }
    if (filters.type && filters.type !== "all" && m.type !== filters.type) return false;
    return true;
  });
}

export interface AuditFilters {
  search?: string;
  severity?: string;
  category?: string;
  from?: string;
  to?: string;
}

function filterAudit(logs: AuditLog[], filters?: AuditFilters): AuditLog[] {
  if (!filters) return logs;
  return logs.filter((l) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !l.adminName.toLowerCase().includes(q) &&
        !l.action.toLowerCase().includes(q) &&
        !l.resource.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.severity && filters.severity !== "all" && l.severity !== filters.severity) return false;
    if (filters.category && filters.category !== "all" && l.category !== filters.category) return false;
    if (filters.from && new Date(l.timestamp) < new Date(filters.from)) return false;
    if (filters.to && new Date(l.timestamp) > new Date(filters.to)) return false;
    return true;
  });
}

export const adminDataService = {
  dashboard: {
    getMetrics: async (): Promise<DashboardMetrics> => delay(getMockDashboardMetrics()),
  },

  members: {
    list: async (filters?: MemberFilters): Promise<Member[]> =>
      delay(filterMembers(membersStore, filters)),
    get: async (id: string): Promise<Member | null> =>
      delay(membersStore.find((m) => m.id === id) ?? null),
    suspend: async (id: string): Promise<void> => {
      membersStore = membersStore.map((m) => (m.id === id ? { ...m, status: "suspended" } : m));
      return delay(undefined);
    },
    reactivate: async (id: string): Promise<void> => {
      membersStore = membersStore.map((m) => (m.id === id ? { ...m, status: "active" } : m));
      return delay(undefined);
    },
    updateRole: async (id: string, role: string): Promise<void> => {
      membersStore = membersStore.map((m) =>
        m.id === id ? { ...m, role: role as Member["role"] } : m
      );
      return delay(undefined);
    },
    updateMembership: async (id: string, level: string): Promise<void> => {
      membersStore = membersStore.map((m) =>
        m.id === id ? { ...m, membershipLevel: level as Member["membershipLevel"] } : m
      );
      return delay(undefined);
    },
    resetPassword: async (_id: string): Promise<void> => delay(undefined),
    export: async (filters?: MemberFilters): Promise<string> =>
      delay(toCSV(filterMembers(membersStore, filters) as unknown as Record<string, unknown>[])),
  },

  courses: {
    list: async (filters?: CourseFilters): Promise<Course[]> =>
      delay(filterCourses(coursesStore, filters)),
    get: async (id: string): Promise<Course | null> =>
      delay(coursesStore.find((c) => c.id === id) ?? null),
    create: async (course: Partial<Course>): Promise<Course> => {
      const now = new Date().toISOString();
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: course.title ?? "Untitled Course",
        slug: course.slug ?? "untitled-course",
        description: course.description ?? "",
        category: course.category ?? "Financial Literacy",
        instructor: course.instructor ?? "",
        status: course.status ?? "draft",
        publishedAt: course.publishedAt,
        scheduledAt: course.scheduledAt,
        enrollments: 0,
        completions: 0,
        rating: 0,
        thumbnail: course.thumbnail,
        price: course.price ?? 0,
        isFree: course.isFree ?? true,
        lessons: course.lessons ?? 0,
        duration: course.duration ?? "0h 0m",
        createdAt: now,
        updatedAt: now,
        tags: course.tags ?? [],
      };
      coursesStore = [newCourse, ...coursesStore];
      return delay(newCourse);
    },
    update: async (id: string, patch: Partial<Course>): Promise<Course | null> => {
      let updated: Course | null = null;
      coursesStore = coursesStore.map((c) => {
        if (c.id === id) {
          updated = { ...c, ...patch, updatedAt: new Date().toISOString() };
          return updated;
        }
        return c;
      });
      return delay(updated);
    },
    archive: async (id: string): Promise<void> => {
      coursesStore = coursesStore.map((c) => (c.id === id ? { ...c, status: "archived" } : c));
      return delay(undefined);
    },
    publish: async (id: string): Promise<void> => {
      coursesStore = coursesStore.map((c) =>
        c.id === id ? { ...c, status: "published", publishedAt: new Date().toISOString() } : c
      );
      return delay(undefined);
    },
    unpublish: async (id: string): Promise<void> => {
      coursesStore = coursesStore.map((c) => (c.id === id ? { ...c, status: "draft" } : c));
      return delay(undefined);
    },
    duplicate: async (id: string): Promise<Course | null> => {
      const source = coursesStore.find((c) => c.id === id);
      if (!source) return delay(null);
      const now = new Date().toISOString();
      const copy: Course = {
        ...source,
        id: `course-${Date.now()}`,
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy`,
        status: "draft",
        enrollments: 0,
        completions: 0,
        createdAt: now,
        updatedAt: now,
      };
      coursesStore = [copy, ...coursesStore];
      return delay(copy);
    },
  },

  content: {
    list: async (filters?: ContentFilters): Promise<ContentItem[]> =>
      delay(filterContent(contentStore, filters)),
    get: async (id: string): Promise<ContentItem | null> =>
      delay(contentStore.find((c) => c.id === id) ?? null),
    create: async (item: Partial<ContentItem>): Promise<ContentItem> => {
      const now = new Date().toISOString();
      const newItem: ContentItem = {
        id: `content-${Date.now()}`,
        title: item.title ?? "Untitled",
        slug: item.slug ?? "untitled",
        type: item.type ?? "blog",
        status: item.status ?? "draft",
        author: item.author ?? "Admin",
        excerpt: item.excerpt,
        body: item.body,
        featuredImage: item.featuredImage,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        seoKeywords: item.seoKeywords ?? [],
        categories: item.categories ?? [],
        tags: item.tags ?? [],
        publishedAt: item.publishedAt,
        scheduledAt: item.scheduledAt,
        createdAt: now,
        updatedAt: now,
        views: 0,
      };
      contentStore = [newItem, ...contentStore];
      return delay(newItem);
    },
    update: async (id: string, patch: Partial<ContentItem>): Promise<ContentItem | null> => {
      let updated: ContentItem | null = null;
      contentStore = contentStore.map((c) => {
        if (c.id === id) {
          updated = { ...c, ...patch, updatedAt: new Date().toISOString() };
          return updated;
        }
        return c;
      });
      return delay(updated);
    },
    publish: async (id: string): Promise<void> => {
      contentStore = contentStore.map((c) =>
        c.id === id ? { ...c, status: "published", publishedAt: new Date().toISOString() } : c
      );
      return delay(undefined);
    },
    archive: async (id: string): Promise<void> => {
      contentStore = contentStore.map((c) => (c.id === id ? { ...c, status: "archived" } : c));
      return delay(undefined);
    },
  },

  media: {
    list: async (filters?: MediaFilters): Promise<MediaItem[]> =>
      delay(filterMedia(mediaStore, filters)),
    get: async (id: string): Promise<MediaItem | null> =>
      delay(mediaStore.find((m) => m.id === id) ?? null),
    upload: async (item: Partial<MediaItem>): Promise<MediaItem> => {
      const now = new Date().toISOString();
      const newItem: MediaItem = {
        id: `media-${Date.now()}`,
        filename: item.filename ?? "untitled-file",
        originalName: item.originalName ?? item.filename ?? "untitled-file",
        type: item.type ?? "other",
        mimeType: item.mimeType ?? "application/octet-stream",
        size: item.size ?? 0,
        url: item.url ?? "",
        thumbnailUrl: item.thumbnailUrl,
        altText: item.altText,
        caption: item.caption,
        tags: item.tags ?? [],
        uploadedBy: item.uploadedBy ?? "Admin",
        uploadedAt: now,
        usedIn: [],
      };
      mediaStore = [newItem, ...mediaStore];
      return delay(newItem);
    },
    update: async (id: string, patch: Partial<MediaItem>): Promise<MediaItem | null> => {
      let updated: MediaItem | null = null;
      mediaStore = mediaStore.map((m) => {
        if (m.id === id) {
          updated = { ...m, ...patch };
          return updated;
        }
        return m;
      });
      return delay(updated);
    },
    delete: async (id: string): Promise<void> => {
      mediaStore = mediaStore.filter((m) => m.id !== id);
      return delay(undefined);
    },
  },

  audit: {
    list: async (filters?: AuditFilters): Promise<AuditLog[]> =>
      delay(filterAudit(auditStore, filters)),
    export: async (filters?: AuditFilters): Promise<string> =>
      delay(toCSV(filterAudit(auditStore, filters) as unknown as Record<string, unknown>[])),
  },

  config: {
    get: async (): Promise<SystemConfig> => delay(configStore),
    update: async (patch: Partial<SystemConfig>): Promise<SystemConfig> => {
      configStore = { ...configStore, ...patch };
      return delay(configStore);
    },
  },

  roles: {
    list: async (): Promise<RoleConfig[]> => delay(roleStore),
    update: async (role: string, permissions: RoleConfig["permissions"]): Promise<void> => {
      roleStore = roleStore.map((r) => (r.role === role ? { ...r, permissions } : r));
      return delay(undefined);
    },
  },
};

export type { AuditLog, ContentItem, Course, DashboardMetrics, Member, MediaItem, RoleConfig, SystemConfig };
