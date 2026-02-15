// lib/types/user-profile.ts

export type BusinessStatus =
  | "registered"
  | "unregistered"
  | "in_progress";

export type UserProfile = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  ageRange?: "under_18" | "18_24" | "25_34" | "35_44" | "45_plus";
  businessStatus?: BusinessStatus;
  createdAt?: string;
  updatedAt?: string;
};
