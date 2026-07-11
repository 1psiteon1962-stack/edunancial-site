export interface FamilyAccount {
  id: string;
  name: string;
  role: "Parent" | "Child";
  ageBand: string;
  focus: string;
  progress: number;
  permissions: string[];
}

export interface HouseholdGoal {
  id: string;
  title: string;
  target: string;
  progress: number;
  status: string;
}

export interface SharedProgressItem {
  id: string;
  learner: string;
  course: string;
  completion: number;
  milestone: string;
}

export interface ParentPermission {
  id: string;
  title: string;
  description: string;
}

export interface FamilyRecommendation {
  id: string;
  ageGroup: string;
  title: string;
  reason: string;
  duration: string;
}

export interface FamilyAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FamilyNotificationItem {
  id: string;
  title: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  action: string;
}

export interface FamilyReport {
  id: string;
  title: string;
  summary: string;
  metric: string;
}

export const familyAccounts: FamilyAccount[] = [
  {
    id: "acct-parent-1",
    name: "Jordan Carter",
    role: "Parent",
    ageBand: "Adult mentor",
    focus: "Guides household goals, permissions, and weekly reviews.",
    progress: 88,
    permissions: [
      "Approve new courses",
      "Set screen time windows",
      "Review financial milestones",
    ],
  },
  {
    id: "acct-child-1",
    name: "Maya Carter",
    role: "Child",
    ageBand: "Ages 8-12",
    focus: "Learning saving habits, needs vs. wants, and budgeting basics.",
    progress: 74,
    permissions: [
      "Earn goal badges",
      "Join family challenges",
      "Request a new lesson",
    ],
  },
  {
    id: "acct-child-2",
    name: "Ethan Carter",
    role: "Child",
    ageBand: "Ages 13-17",
    focus: "Building business, investing, and entrepreneurship confidence.",
    progress: 81,
    permissions: [
      "Track business projects",
      "Unlock teen electives",
      "Share progress reflections",
    ],
  },
];

export const familyDashboardStats = [
  { label: "Active learners", value: "3" },
  { label: "Household score", value: "81%" },
  { label: "Goals on track", value: "4/5" },
  { label: "Family streak", value: "12 weeks" },
];

export const householdGoals: HouseholdGoal[] = [
  {
    id: "goal-emergency-fund",
    title: "Emergency fund challenge",
    target: "$1,200 family target",
    progress: 68,
    status: "On track for August completion",
  },
  {
    id: "goal-reading",
    title: "Family reading sprint",
    target: "6 lessons and 2 book summaries",
    progress: 84,
    status: "One reflection left to complete",
  },
  {
    id: "goal-business",
    title: "Teen venture launch plan",
    target: "Prototype, pricing, and pitch deck",
    progress: 57,
    status: "Needs one parent review session",
  },
];

export const sharedProgress: SharedProgressItem[] = [
  {
    id: "progress-1",
    learner: "Jordan",
    course: "Family Money Systems",
    completion: 92,
    milestone: "Reviewed household goal report",
  },
  {
    id: "progress-2",
    learner: "Maya",
    course: "Smart Saving for Kids",
    completion: 76,
    milestone: "Completed savings jar activity",
  },
  {
    id: "progress-3",
    learner: "Ethan",
    course: "Teen Entrepreneur Lab",
    completion: 81,
    milestone: "Submitted pricing worksheet",
  },
];

export const parentPermissions: ParentPermission[] = [
  {
    id: "permission-1",
    title: "Approve content by age band",
    description:
      "Parents control course access for children and unlock advanced pathways when learners are ready.",
  },
  {
    id: "permission-2",
    title: "Monitor financial goals",
    description:
      "Parents can review progress trends, savings habits, and shared challenge completion from one dashboard.",
  },
  {
    id: "permission-3",
    title: "Manage reminders and celebrations",
    description:
      "Set gentle nudges for missed lessons and automatic celebrations for completed family milestones.",
  },
];

export const familyRecommendations: FamilyRecommendation[] = [
  {
    id: "recommendation-1",
    ageGroup: "Ages 8-12",
    title: "Money Habits for Everyday Choices",
    reason: "Builds confidence with saving, spending, and goal setting using short guided activities.",
    duration: "20-minute lessons",
  },
  {
    id: "recommendation-2",
    ageGroup: "Ages 13-17",
    title: "Teen Entrepreneur Lab",
    reason: "Pairs budgeting, pricing, and sales strategy with age-appropriate business projects.",
    duration: "4-week pathway",
  },
  {
    id: "recommendation-3",
    ageGroup: "Parents",
    title: "Raising Financially Confident Families",
    reason: "Shows adults how to coach learners, assign responsibilities, and review progress together.",
    duration: "Weekly family workshop",
  },
];

export const familyAchievements: FamilyAchievement[] = [
  {
    id: "achievement-1",
    title: "Budget Builders",
    description: "Completed the first shared household budget review.",
    icon: "💡",
  },
  {
    id: "achievement-2",
    title: "Savings Streak",
    description: "Reached 10 straight weeks of goal updates.",
    icon: "🏦",
  },
  {
    id: "achievement-3",
    title: "Challenge Champions",
    description: "Finished every activity in the monthly family challenge.",
    icon: "🏆",
  },
];

export const familyNotifications: FamilyNotificationItem[] = [
  {
    id: "notification-1",
    title: "Weekly family review is ready",
    message:
      "Your household report shows stronger saving habits and one course recommendation for each learner.",
    priority: "High",
    action: "Open reporting",
  },
  {
    id: "notification-2",
    title: "Maya earned a new badge",
    message:
      "Celebrate the Smart Saver badge and unlock the next budgeting challenge together.",
    priority: "Medium",
    action: "View achievement",
  },
  {
    id: "notification-3",
    title: "Teen venture checkpoint tomorrow",
    message:
      "Ethan has a parent approval checkpoint for pricing and product feedback.",
    priority: "Low",
    action: "Review permissions",
  },
];

export const familyReports: FamilyReport[] = [
  {
    id: "report-1",
    title: "Household momentum report",
    summary:
      "Tracks course completion, challenge streaks, and weekly participation across every learner.",
    metric: "81% average engagement",
  },
  {
    id: "report-2",
    title: "Goal readiness report",
    summary:
      "Highlights savings growth, budget consistency, and which goals need extra coaching support.",
    metric: "4 of 5 goals on pace",
  },
  {
    id: "report-3",
    title: "Parent coaching summary",
    summary:
      "Shows approvals, reminders, and reflection notes so adults can coach with less guesswork.",
    metric: "6 parent actions this week",
  },
];
