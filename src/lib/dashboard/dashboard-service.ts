export interface DashboardData {

  memberName: string;

  membershipLevel: string;

  competencyScore: number | null;

  certificatesEarned: number;

  coursesCompleted: number;

  coursesStarted: number;

  assessmentCompleted: boolean;

}

export async function getDashboardData(): Promise<DashboardData> {

  // Future:
  // Database
  // Clerk/Auth.js
  // Supabase
  // PostgreSQL

  return {

    memberName: "Member",

    membershipLevel: "Basic",

    competencyScore: null,

    certificatesEarned: 0,

    coursesCompleted: 0,

    coursesStarted: 0,

    assessmentCompleted: false,

  };

}
