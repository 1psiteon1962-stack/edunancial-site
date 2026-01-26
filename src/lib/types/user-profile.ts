// src/lib/types/user-profile.ts

export type UserProfile = {
  id: string;
  email: string;
  createdAt: string;

  plan: "free" | "starter" | "builder" | "pro" | "enterprise";

  region?: string;
  language?: string;
};
