// lib/membership.ts

export type MembershipLevel = "free" | "Builder" | "Foundation" | "Visionary";

const KEY = "edunancial_membership_level";

export function getMembershipLevel(): MembershipLevel {
  if (typeof window === "undefined") return "free";
  const raw = localStorage.getItem(KEY);
  if (raw === "Builder" || raw === "Foundation" || raw === "Visionary" || raw === "free") return raw;
  return "free";
}

export function setMembershipLevel(level: MembershipLevel) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, level);
}
