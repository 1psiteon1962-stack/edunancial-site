import { Member } from "@/types/member";

export async function getCurrentMember(): Promise<Member> {
  return {
    id: "demo",

    firstName: "Guest",

    lastName: "User",

    email: "guest@example.com",

    country: "United States",

    state: "California",

    city: "Los Angeles",

    preferredLanguage: "English",

    preferredCurrency: "USD",

    membershipLevel: "Basic",

    joinedDate: new Date(),

    lastLogin: new Date(),

    competencyScore: null,

    assessmentCompleted: false,

    aiCoachEnabled: true,
  };
}
