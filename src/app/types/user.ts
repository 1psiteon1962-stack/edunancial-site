// src/app/types/user.ts

/**
 * Canonical user profile type
 * Used by API routes and access logic
 */
export interface UserProfile {
  id?: string;
  email: string;

  plan?: string;

  createdAt?: string;
  updatedAt?: string;
}
