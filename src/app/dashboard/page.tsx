import type { Metadata } from "next";

import PersonalizedMemberDashboard from "@/components/dashboard/PersonalizedMemberDashboard";

export const metadata: Metadata = {
  title: "Personalized Member Dashboard",
  description:
    "Track learning progress, resume recent courses, discover personalized recommendations, and access Edunancial financial tools from one member dashboard.",
};

export default function DashboardPage() {
  return <PersonalizedMemberDashboard />;
}
