import type { Metadata } from "next";
import FinancialToolsSection from "@/components/financial-tools/FinancialToolsSection";

export const metadata: Metadata = {
  title: "Financial Tools That Help You Take Action | Edunancial",
  description:
    "Explore Edunancial financial calculators and financial education tools, including a budget calculator and upcoming tools like a debt payoff planner and retirement calculator.",
};

export default function FinancialToolsPage() {
  return <FinancialToolsSection />;
}
