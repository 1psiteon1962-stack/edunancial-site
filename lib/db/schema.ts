// lib/db/schema.ts

/**
 * Minimal shared DB schema types.
 * This file MUST exist because API routes import from "@/lib/db/schema".
 */

export type ParticipantProfile = {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  region?: string;
  language?: string;

  createdAt: string; // ISO string
};
