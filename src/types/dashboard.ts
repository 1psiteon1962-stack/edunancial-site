export interface DashboardNotification {

  id: string;

  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  createdAt: Date;

  read: boolean;

}

export interface DashboardWidget {

  id: string;

  title: string;

  enabled: boolean;

}

export interface DashboardSummary {

  competencyScore: number | null;

  certificates: number;

  completedCourses: number;

  activeMembership: string;

}
