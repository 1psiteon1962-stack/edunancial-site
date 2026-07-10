export type ForumCategory =
  | "budgeting"
  | "credit"
  | "investing"
  | "retirement"
  | "taxes"
  | "insurance"
  | "entrepreneurship"
  | "real-estate"
  | "fraud-prevention"
  | "general";

export type ReputationBadge =
  | "newcomer"
  | "contributor"
  | "trusted"
  | "expert"
  | "champion";

export type ModerationStatus = "pending" | "approved" | "removed" | "flagged";

export type ReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "inappropriate"
  | "off-topic"
  | "other";

export type UserStanding =
  | "good"
  | "warned"
  | "suspended"
  | "banned";

export interface ForumCategoryMeta {
  slug: ForumCategory;
  label: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  color: string;
}

export interface CommunityMember {
  id: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  avatarColor: string;
  joinedDate: string;
  reputationPoints: number;
  badge: ReputationBadge;
  standing: UserStanding;
  helpfulAnswers: number;
  threadCount: number;
  postCount: number;
  bio?: string;
  expertise?: ForumCategory[];
}

export interface DiscussionTag {
  id: string;
  label: string;
}

export interface DiscussionPost {
  id: string;
  authorId: string;
  author: CommunityMember;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isHelpful?: boolean;
  status: ModerationStatus;
  quotedPostId?: string;
  quotedContent?: string;
  reportCount: number;
}

export interface Discussion {
  id: string;
  title: string;
  slug: string;
  category: ForumCategory;
  tags: DiscussionTag[];
  authorId: string;
  author: CommunityMember;
  content: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  replyCount: number;
  isBookmarked?: boolean;
  isPinned?: boolean;
  isFeatured?: boolean;
  isStaffPick?: boolean;
  status: ModerationStatus;
  replies: DiscussionPost[];
  reportCount: number;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporter: CommunityMember;
  targetType: "discussion" | "reply";
  targetId: string;
  targetTitle?: string;
  reason: ReportReason;
  details?: string;
  createdAt: string;
  status: "open" | "resolved" | "dismissed";
  resolvedBy?: string;
  resolvedAt?: string;
  action?: "approved" | "removed" | "warned" | "suspended" | "banned";
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: "discussion" | "reply" | "user";
  targetId: string;
  targetLabel: string;
  timestamp: string;
  details?: string;
}

export interface CommunityStats {
  totalMembers: number;
  totalDiscussions: number;
  totalPosts: number;
  activeToday: number;
  weeklyGrowth: number;
}
