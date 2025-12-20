export type EdunancialLevel = {
  level: number;
  title: string;
  audience: string;
  access: "public" | "member" | "invite";
  monetization: "free" | "subscription" | "premium";
};

export const EDUNANCIAL_LEVELS: EdunancialLevel[] = [
  {
    level: 1,
    title: "Foundations",
    audience: "Youth, Families, First-Time Learners",
    access: "public",
    monetization: "free",
  },
  {
    level: 2,
    title: "Operator",
    audience: "Entrepreneurs, Side Hustlers",
    access: "member",
    monetization: "subscription",
  },
  {
    level: 3,
    title: "Builder",
    audience: "Business Owners, Investors",
    access: "member",
    monetization: "subscription",
  },
  {
    level: 4,
    title: "Scaler",
    audience: "Advanced Entrepreneurs",
    access: "invite",
    monetization: "premium",
  },
  {
    level: 5,
    title: "Capital Architect",
    audience: "Partners, PE, Strategic Capital",
    access: "invite",
    monetization: "premium",
  },
];
