/**
 * AI Coach Notification Manager
 * Generates and manages personalized notifications for members.
 * Categories: daily reminders, weekly reports, goal milestones,
 * course reminders, assessment reminders, achievements.
 */

import {
  AINotification,
  NotificationCategory,
  NotificationPriority,
  GoalProgress,
  CompetencyScores,
} from "@/types/ai-coach";

let _notifId = 0;

function makeNotif(
  overrides: Omit<AINotification, "id" | "createdAt" | "isRead" | "isDismissed">
): AINotification {
  _notifId += 1;
  return {
    ...overrides,
    id: `notif-${_notifId}`,
    isRead: false,
    isDismissed: false,
    createdAt: new Date().toISOString(),
  };
}

// ─── Notification generators ───────────────────────────────────────────────

export function buildDailyReminder(
  memberId: string,
  memberName: string
): AINotification {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return makeNotif({
    memberId,
    category: "dailyReminder",
    priority: "medium",
    title: `${greeting}, ${memberName}`,
    message: "Take 15 minutes today to continue your learning path and move closer to your goals.",
    actionUrl: "/ai-coach",
    actionLabel: "Open Coach",
  });
}

export function buildWeeklyReport(
  memberId: string,
  minutesLearned: number,
  goalsOnTrack: number
): AINotification {
  return makeNotif({
    memberId,
    category: "weeklyReport",
    priority: "medium",
    title: "Your Weekly Progress Report",
    message: `This week you learned for ${minutesLearned} minutes and have ${goalsOnTrack} goal(s) on track. Keep building!`,
    actionUrl: "/ai-coach/insights",
    actionLabel: "View Insights",
  });
}

export function buildGoalMilestoneNotif(
  memberId: string,
  goalTitle: string,
  milestoneTitle: string
): AINotification {
  return makeNotif({
    memberId,
    category: "goalMilestone",
    priority: "high",
    title: "🎯 Goal Milestone Reached!",
    message: `You reached "${milestoneTitle}" on your "${goalTitle}" goal. Great progress!`,
    actionUrl: "/ai-coach/goals",
    actionLabel: "View Goals",
  });
}

export function buildAssessmentReminder(
  memberId: string,
  isFirstTime: boolean
): AINotification {
  return makeNotif({
    memberId,
    category: "assessmentReminder",
    priority: isFirstTime ? "high" : "low",
    title: isFirstTime
      ? "Complete Your Financial Assessment"
      : "Time for Your Quarterly Assessment",
    message: isFirstTime
      ? "Unlock personalized recommendations by completing your 20-minute Financial Competency Assessment."
      : "Retake your assessment to measure how much your competency has improved.",
    actionUrl: "/assessment",
    actionLabel: "Start Assessment",
  });
}

export function buildCourseReminder(
  memberId: string,
  courseTitle: string,
  courseUrl: string
): AINotification {
  return makeNotif({
    memberId,
    category: "courseReminder",
    priority: "low",
    title: "Continue Your Course",
    message: `You haven't continued "${courseTitle}" in a while. Pick up where you left off.`,
    actionUrl: courseUrl,
    actionLabel: "Continue Learning",
  });
}

export function buildAchievementNotif(
  memberId: string,
  achievementTitle: string,
  achievementDescription: string
): AINotification {
  return makeNotif({
    memberId,
    category: "achievement",
    priority: "high",
    title: `🏆 Achievement Unlocked: ${achievementTitle}`,
    message: achievementDescription,
    actionUrl: "/achievements",
    actionLabel: "View Achievements",
  });
}

// ─── Batch generation ─────────────────────────────────────────────────────

export function generateNotificationsForMember(
  memberId: string,
  memberName: string,
  context: {
    assessmentCompleted: boolean;
    goalProgress: GoalProgress[];
    scores: CompetencyScores | null;
    minutesLearnedThisWeek: number;
  }
): AINotification[] {
  const notifications: AINotification[] = [];

  notifications.push(buildDailyReminder(memberId, memberName));

  if (!context.assessmentCompleted) {
    notifications.push(buildAssessmentReminder(memberId, true));
  }

  const onTrack = context.goalProgress.filter((g) => g.isOnTrack).length;
  if (onTrack > 0) {
    notifications.push(
      buildWeeklyReport(memberId, context.minutesLearnedThisWeek, onTrack)
    );
  }

  // Check for recently completed milestones
  for (const gp of context.goalProgress) {
    for (const milestone of gp.goal.milestones) {
      if (
        milestone.completedAt &&
        new Date(milestone.completedAt).getTime() > Date.now() - 7 * 86400000
      ) {
        notifications.push(
          buildGoalMilestoneNotif(memberId, gp.goal.title, milestone.title)
        );
      }
    }
  }

  if (context.scores && context.scores.overall >= 80) {
    notifications.push(
      buildAchievementNotif(
        memberId,
        "Financial Competent",
        "You've achieved an overall Financial Competency Score of 80+. You're building real financial mastery."
      )
    );
  }

  return notifications;
}

// ─── Demo notifications (replace with DB) ─────────────────────────────────

export function getDemoNotifications(memberId: string): AINotification[] {
  return [
    makeNotif({
      memberId,
      category: "dailyReminder",
      priority: "medium",
      title: "Good morning! Ready to learn?",
      message: "You're on a 5-day learning streak. Keep it up — 15 minutes today makes a difference.",
      actionUrl: "/ai-coach",
      actionLabel: "Open Coach",
    }),
    makeNotif({
      memberId,
      category: "goalMilestone",
      priority: "high",
      title: "🎯 You hit 40% on your Emergency Fund goal!",
      message: "You've saved $7,200 of your $18,000 emergency fund. You're on track to finish in 6 months.",
      actionUrl: "/ai-coach/goals",
      actionLabel: "View Goals",
    }),
    makeNotif({
      memberId,
      category: "weeklyReport",
      priority: "medium",
      title: "Weekly Progress Report",
      message: "Last week: 95 minutes learned, 2 goals on track, competency up +3 points.",
      actionUrl: "/ai-coach/insights",
      actionLabel: "View Insights",
    }),
    makeNotif({
      memberId,
      category: "achievement",
      priority: "high",
      title: "🏆 Achievement: First Goal Created",
      message: "You created your first financial goal. Goal-setters are 42% more likely to achieve financial independence.",
      actionUrl: "/achievements",
      actionLabel: "View Achievements",
    }),
    makeNotif({
      memberId,
      category: "courseReminder",
      priority: "low",
      title: "Continue: Building Wealth Through Real Estate",
      message: "You're 60% through this course. Resume to earn your Real Estate certificate.",
      actionUrl: "/courses",
      actionLabel: "Continue Learning",
    }),
  ];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function markNotificationRead(
  notifications: AINotification[],
  id: string
): AINotification[] {
  return notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
}

export function dismissNotification(
  notifications: AINotification[],
  id: string
): AINotification[] {
  return notifications.map((n) =>
    n.id === id ? { ...n, isDismissed: true } : n
  );
}

export function getUnreadCount(notifications: AINotification[]): number {
  return notifications.filter((n) => !n.isRead && !n.isDismissed).length;
}

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  dailyReminder: "Daily Reminder",
  weeklyReport: "Weekly Report",
  goalMilestone: "Goal Milestone",
  courseReminder: "Course Reminder",
  assessmentReminder: "Assessment Reminder",
  achievement: "Achievement",
  system: "System",
};

export const NOTIFICATION_PRIORITY_COLORS: Record<NotificationPriority, string> = {
  high: "border-yellow-500",
  medium: "border-blue-500",
  low: "border-slate-600",
};
