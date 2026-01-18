export interface UserProfileKPI {
  userId: string;
  createdAt: string;

  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  address?: string;

  region: string;
  level: string;

  businessName?: string;
  businessJurisdiction?: string;
  businessType?: "formal" | "informal";

  businessStage: string;
  timestamp: string;
}
