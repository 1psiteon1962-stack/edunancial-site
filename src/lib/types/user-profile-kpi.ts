export interface UserProfileKPI {
  id: string;

  // user association
  userId: string;

  // identity
  firstName: string;
  lastName: string;

  // KPI metadata
  title: string;
  value: number;
  description?: string;

  // audit
  createdAt: string;
}
