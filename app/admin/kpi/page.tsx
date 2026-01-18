import React from "react";

/**
 * ADMIN-ONLY USER PROFILE
 * This is intentionally defined locally to avoid type shadowing
 * across lib/domain layers during Netlify builds.
 */
type UserProfile = {
  userId: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  level?: string;
};

const mockData: UserProfile[] = [
  {
    userId: "sample",
    createdAt: new Date().toISOString(),
    firstName: "Sample",
    lastName: "User",
    email: "sample@example.com",
    level: "Level 1",
  },
];

export default function AdminKPIPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin KPI</h1>
      <pre>{JSON.stringify(mockData, null, 2)}</pre>
    </div>
  );
}
