export interface Member {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  country: string;

  state?: string;

  city?: string;

  preferredLanguage: string;

  preferredCurrency: string;

  membershipLevel: string;

  joinedDate: Date;

  lastLogin: Date;

  competencyScore: number | null;

  assessmentCompleted: boolean;

  aiCoachEnabled: boolean;
}
