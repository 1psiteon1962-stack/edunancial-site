export interface FeatureFlags {
  books: boolean;
  courses: boolean;
  memberships: boolean;
  downloads: boolean;
  adminPortal: boolean;
  executiveDashboard: boolean;
  multilingual: boolean;
  analytics: boolean;
}

export const featureFlags: FeatureFlags = {
  books: true,
  courses: true,
  memberships: true,
  downloads: true,
  adminPortal: true,
  executiveDashboard: true,
  multilingual: true,
  analytics: true,
};
