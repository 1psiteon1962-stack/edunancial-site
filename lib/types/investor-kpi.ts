export type AcquisitionChannel =
  | "organic"
  | "referral"
  | "paid"
  | "partner"
  | "unknown";

export type EngagementLevel =
  | "low"
  | "medium"
  | "high";

export type MonetizationStatus =
  | "free"
  | "trial"
  | "paid"
  | "enterprise";

export interface InvestorKPI {
  acquisitionChannel: AcquisitionChannel;
  engagementLevel: EngagementLevel;
  monetizationStatus: MonetizationStatus;

  timeToFirstActionDays?: number;
  completedDiagnostic: boolean;

  cohortMonth: string; // YYYY-MM
  isRepeatUser: boolean;
}
