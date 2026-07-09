import type {
  AuditLog,
  ContentItem,
  Course,
  DashboardMetrics,
  Member,
  MediaItem,
} from "./types";

// Deterministic pseudo-random helper so mock data is stable across renders/builds.
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(items: readonly T[], r: () => number = rand): T {
  return items[Math.floor(r() * items.length)];
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const FIRST_NAMES = [
  "Amara", "James", "Olivia", "Noah", "Chidinma", "Liam", "Grace", "Kwame",
  "Sofia", "Ethan", "Aaliyah", "Mason", "Ngozi", "Lucas", "Ava", "Kofi",
  "Isabella", "Elijah", "Fatima", "Daniel", "Zara", "Michael", "Amina", "Jacob",
  "Nia", "William", "Chioma", "Benjamin", "Adaeze", "Samuel",
];
const LAST_NAMES = [
  "Okafor", "Smith", "Johnson", "Adeyemi", "Williams", "Mensah", "Brown",
  "Nwosu", "Davis", "Bello", "Miller", "Okonkwo", "Wilson", "Abara", "Moore",
  "Eze", "Taylor", "Anderson", "Balogun", "Thomas",
];
const COUNTRIES = [
  "United States", "Canada", "Nigeria", "Ghana", "Kenya", "South Africa",
  "Jamaica", "United Kingdom", "Trinidad and Tobago", "Barbados",
];

function fullName(r: () => number = rand): string {
  return `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`;
}

function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
}

// ---------------------------------------------------------------------------
// Dashboard metrics
// ---------------------------------------------------------------------------

export function getMockDashboardMetrics(): DashboardMetrics {
  return {
    totalMembers: 12847,
    activeMembers: 9234,
    newRegistrations: 284,
    subscriptionRevenue: 47320,
    courseEnrollments: 1847,
    courseCompletions: 923,
    calculatorUsage: 3412,
    websiteTraffic: 48291,
    supportTickets: 47,
    recentActivity: getMockAuditLogs(10),
  };
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

const MEMBERSHIP_LEVELS: Member["membershipLevel"][] = [
  "free", "basic", "premium", "elite", "enterprise",
];
const MEMBER_ROLES: Member["role"][] = ["member", "instructor", "admin"];
const MEMBER_STATUSES: Member["status"][] = ["active", "suspended", "pending"];

export function getMockMembers(count = 25): Member[] {
  const members: Member[] = [];
  for (let i = 0; i < count; i++) {
    const name = fullName();
    const enrolled = Math.floor(rand() * 12) + 1;
    const completed = Math.floor(rand() * enrolled);
    members.push({
      id: `mem-${1000 + i}`,
      name,
      email: emailFor(name),
      phone: `+1-${Math.floor(200 + rand() * 700)}-555-${String(
        Math.floor(rand() * 9000) + 1000
      )}`,
      membershipLevel: pick(MEMBERSHIP_LEVELS),
      role: i < 2 ? "admin" : pick(MEMBER_ROLES),
      status: i % 11 === 0 ? "suspended" : i % 7 === 0 ? "pending" : "active",
      joinedAt: daysAgo(Math.floor(rand() * 720) + 5),
      lastLoginAt: daysAgo(Math.floor(rand() * 30)),
      coursesEnrolled: enrolled,
      coursesCompleted: completed,
      totalSpent: Math.round(rand() * 2400),
      country: pick(COUNTRIES),
    });
  }
  return members;
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

const COURSE_TITLES = [
  "Financial Literacy Fundamentals",
  "Real Estate Investing 101",
  "Building Your First Business Plan",
  "Stock Market Essentials",
  "Personal Budgeting Mastery",
  "Credit Repair & Building Wealth",
  "Advanced Real Estate Syndication",
  "Passive Income Through Paper Assets",
  "Entrepreneurship Bootcamp",
  "Retirement & Estate Planning",
  "Tax Strategy for Business Owners",
  "Understanding Cryptocurrency Safely",
  "Negotiation Skills for Entrepreneurs",
  "Scaling a Small Business",
  "Financial Independence Roadmap",
];
const CATEGORIES = [
  "Financial Literacy", "Real Estate", "Business", "Investing", "Entrepreneurship",
];
const INSTRUCTORS = [
  "Dr. Angela Reyes", "Marcus Bell", "Priya Nair", "Samuel Okoye",
  "Dana Whitfield", "Leo Fontaine", "Rachel Kim",
];
const COURSE_STATUSES: Course["status"][] = [
  "draft", "review", "published", "archived", "scheduled",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getMockCourses(count = 15): Course[] {
  const titles = COURSE_TITLES.slice(0, count);
  return titles.map((title, i) => {
    const status = i < 9 ? "published" : pick(COURSE_STATUSES);
    const enrollments = Math.floor(rand() * 900) + 20;
    return {
      id: `course-${100 + i}`,
      title,
      slug: slugify(title),
      description: `A comprehensive Edunancial course covering ${title.toLowerCase()} with practical exercises and downloadable worksheets.`,
      category: pick(CATEGORIES),
      instructor: pick(INSTRUCTORS),
      status,
      publishedAt: status === "published" ? daysAgo(Math.floor(rand() * 300)) : undefined,
      scheduledAt: status === "scheduled" ? daysAgo(-Math.floor(rand() * 20) - 1) : undefined,
      enrollments,
      completions: Math.floor(enrollments * (0.3 + rand() * 0.5)),
      rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
      thumbnail: `https://picsum.photos/seed/course-${i}/400/240`,
      price: i % 4 === 0 ? 0 : Math.round((29 + rand() * 170) / 5) * 5,
      isFree: i % 4 === 0,
      lessons: Math.floor(rand() * 20) + 6,
      duration: `${Math.floor(rand() * 8) + 2}h ${Math.floor(rand() * 6) * 10}m`,
      createdAt: daysAgo(Math.floor(rand() * 500) + 60),
      updatedAt: daysAgo(Math.floor(rand() * 60)),
      tags: [pick(CATEGORIES), "Edunancial", i % 2 === 0 ? "Beginner" : "Advanced"],
    };
  });
}

// ---------------------------------------------------------------------------
// Content items (CMS)
// ---------------------------------------------------------------------------

const CONTENT_TYPES: ContentItem["type"][] = [
  "blog", "news", "faq", "landing", "legal", "resource",
];
const CONTENT_STATUSES: ContentItem["status"][] = [
  "draft", "review", "published", "archived",
];
const CONTENT_TITLES = [
  "5 Steps to Build an Emergency Fund",
  "Edunancial Launches New Country Dashboard",
  "How Does Membership Billing Work?",
  "Financial Freedom Starts Here",
  "Terms of Service",
  "Free Budget Worksheet Download",
  "Understanding Compound Interest",
  "Edunancial Partners With Regional Providers",
  "What Happens If I Cancel My Membership?",
  "Invest With Confidence",
  "Privacy Policy",
  "Real Estate Investing Checklist",
  "The Psychology of Money",
  "New Course Catalog for 2026",
  "How Do I Reset My Password?",
  "Start Your Business Journey Today",
  "Cookie Policy",
  "Retirement Planning Guide (PDF)",
  "5 Mistakes New Investors Make",
  "Edunancial Expands to the Caribbean",
];

export function getMockContentItems(count = 20): ContentItem[] {
  return CONTENT_TITLES.slice(0, count).map((title, i) => {
    const type = pick(CONTENT_TYPES);
    const status = i < 12 ? "published" : pick(CONTENT_STATUSES);
    return {
      id: `content-${200 + i}`,
      title,
      slug: slugify(title),
      type,
      status,
      author: pick(INSTRUCTORS),
      excerpt: `${title} — an Edunancial resource for building financial competency.`,
      body: `## ${title}\n\nThis is placeholder markdown body content for "${title}".`,
      featuredImage: `https://picsum.photos/seed/content-${i}/600/320`,
      seoTitle: title,
      seoDescription: `Learn about ${title.toLowerCase()} on Edunancial.`,
      seoKeywords: ["financial literacy", "edunancial", type],
      categories: [pick(CATEGORIES)],
      tags: [type, "edunancial"],
      publishedAt: status === "published" ? daysAgo(Math.floor(rand() * 300)) : undefined,
      scheduledAt: undefined,
      createdAt: daysAgo(Math.floor(rand() * 400) + 30),
      updatedAt: daysAgo(Math.floor(rand() * 30)),
      views: Math.floor(rand() * 15000),
    };
  });
}

// ---------------------------------------------------------------------------
// Media items
// ---------------------------------------------------------------------------

const MEDIA_TYPES: MediaItem["type"][] = [
  "image", "pdf", "video", "audio", "worksheet", "other",
];
const MIME_BY_TYPE: Record<MediaItem["type"], string> = {
  image: "image/jpeg",
  pdf: "application/pdf",
  video: "video/mp4",
  audio: "audio/mpeg",
  worksheet: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  other: "application/octet-stream",
};

export function getMockMediaItems(count = 20): MediaItem[] {
  const items: MediaItem[] = [];
  for (let i = 0; i < count; i++) {
    const type = pick(MEDIA_TYPES);
    const filename = `${type}-${slugify(pick(COURSE_TITLES))}-${i}.${
      type === "image" ? "jpg" : type === "pdf" ? "pdf" : type === "video" ? "mp4" : type === "audio" ? "mp3" : type === "worksheet" ? "xlsx" : "bin"
    }`;
    items.push({
      id: `media-${300 + i}`,
      filename,
      originalName: filename,
      type,
      mimeType: MIME_BY_TYPE[type],
      size: Math.floor(rand() * 8_000_000) + 20_000,
      url: `https://picsum.photos/seed/media-${i}/800/600`,
      thumbnailUrl: type === "image" ? `https://picsum.photos/seed/media-${i}/200/160` : undefined,
      altText: type === "image" ? `Illustration for ${filename}` : undefined,
      caption: "",
      tags: [type, "edunancial"],
      uploadedBy: pick(INSTRUCTORS),
      uploadedAt: daysAgo(Math.floor(rand() * 250)),
      usedIn: rand() > 0.5 ? [pick(COURSE_TITLES)] : [],
    });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------

const ACTIONS = [
  "Created course", "Updated user role", "Suspended member", "Published content",
  "Deleted media asset", "Updated system config", "Exported report",
  "Reactivated member", "Archived course", "Updated permissions",
  "Sent email campaign", "Reset password", "Logged in", "Updated pricing plan",
];
const CATEGORIES_AUDIT: AuditLog["category"][] = [
  "content", "user", "permission", "billing", "system",
];
const SEVERITIES: AuditLog["severity"][] = ["info", "warning", "critical"];

export function getMockAuditLogs(count = 50): AuditLog[] {
  const logs: AuditLog[] = [];
  for (let i = 0; i < count; i++) {
    const admin = fullName();
    const severity = i % 13 === 0 ? "critical" : i % 5 === 0 ? "warning" : "info";
    logs.push({
      id: `audit-${400 + i}`,
      adminId: `admin-${i % 8}`,
      adminName: admin,
      adminEmail: emailFor(admin),
      action: pick(ACTIONS),
      resource: pick(["course", "user", "content", "media", "config", "membership"]),
      resourceId: `res-${Math.floor(rand() * 900) + 100}`,
      details: "Change applied via Edunancial Admin Portal.",
      ipAddress: `${Math.floor(rand() * 223) + 1}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: daysAgo(rand() * 20),
      severity,
      category: pick(CATEGORIES_AUDIT),
    });
  }
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
