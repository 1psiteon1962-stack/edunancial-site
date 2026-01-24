// lib/airtable.ts
// Minimal build-safe Airtable stub.
// Prevents Webpack module-not-found failures.
// Replace with real Airtable integration when ready.

export type KPIRecord = {
  userId: string;
  metric: string;
  value: number;
  createdAt: string;
};

export async function
