// lib/db/schema.ts

/**
 * Shared DB schema types.
 * Required for API route imports: "@/lib/db/schema"
 */

export type ParticipantProfile = {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  region?: string;
  language?: string;

  createdAt: string;
};
